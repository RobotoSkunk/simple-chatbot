
import database from '../client/database';


class Message
{
	private _id: string;
	private _role: MessageRoles;
	private _contentId: string;
	private _index: number;
	private _content: string;
	private _generationTime: number;
	private _contentCount: number;
	private _editedByUser: number;
	private _createdAt: Date;

	constructor(
		id: string,
		role: MessageRoles,
		contentId: string,
		index: number,
		content: string,
		generationTime: number,
		contentCount: number,
		editedByUser: number,
		createdAt: Date)
	{
		this._id = id;
		this._role = role;
		this._contentId = contentId;
		this._index = index;
		this._content = content;
		this._generationTime = generationTime;
		this._contentCount = contentCount;
		this._editedByUser = editedByUser;
		this._createdAt = createdAt;
	}

	public get id()
	{
		return this._id;
	}

	public get role()
	{
		return this._role;
	}

	public get index()
	{
		return this._index;
	}

	public get contentId()
	{
		return this._contentId;
	}

	public get content()
	{
		return this._content;
	}

	public get generationTime()
	{
		return this._generationTime;
	}

	public get contentCount()
	{
		return this._contentCount;
	}

	public get editedByUser()
	{
		return this._editedByUser;
	}

	public get createdAt()
	{
		return this._createdAt;
	}

	public async updateMessage(content: string, generationTime: number, editedByUser: boolean)
	{
		const lastContentData = await database.conn
			.selectFrom('message_contents')
			.select('index')
			.where('message_id', '=', this._id)
			.orderBy('created_at', 'desc')
			.limit(1)
			.executeTakeFirst();

		if (!lastContentData) {
			return;
		}

		const contentData = await database.conn
			.insertInto('message_contents')
			.values({
				content,
				message_id: this.id,
				index: lastContentData.index as number + 1,
				generation_time: generationTime,
				edited_by_user: editedByUser ? 1 : 0,
			})
			.returning('id')
			.executeTakeFirstOrThrow();

		await database.conn
			.updateTable('messages')
			.set({
				message_content_id: contentData.id,
			})
			.where('id', '=', this._id)
			.execute();

		this._contentId = contentData.id as string;
		this._content = content;
		this._index = lastContentData.index as number + 1;
		this._generationTime = generationTime;
		this._editedByUser = editedByUser ? 1 : 0;
	}

	public async loadContent(index: number)
	{
		const contentData = await database.conn
			.selectFrom('message_contents')
			.select([
				'id',
				'content',
				'generation_time',
				'edited_by_user',
			])
			.where('message_id', '=', this._id)
			.where('index', '=', index)
			.executeTakeFirst();

		if (!contentData) {
			return;
		}

		await database.conn
			.updateTable('messages')
			.set({
				message_content_id: contentData.id,
			})
			.where('id', '=', this._id)
			.execute();

		this._contentId = contentData.id as string;
		this._content = contentData.content as string;
		this._index = index;
		this._generationTime = contentData.generation_time as number;
		this._editedByUser = contentData.edited_by_user as number;
	}

	public async delete()
	{
		await database.conn
			.deleteFrom('messages')
			.where('id', '=', this.id)
			.execute();
	}

	public static async register(chatId: string, role: MessageRoles, content: string, generationTime: number)
	{
		const messageContent = await database.conn
			.insertInto('message_contents')
			.values({
				index: 0,
				content: content,
				generation_time: generationTime,
			})
			.returning('id')
			.executeTakeFirstOrThrow();

		const message = await database.conn
			.insertInto('messages')
			.values({
				role,
				chat_id: chatId,
				message_content_id: messageContent.id,
			})
			.returning([
				'id',
				'created_at',
			])
			.executeTakeFirstOrThrow();

		await database.conn
			.updateTable('message_contents')
			.set({
				message_id: message.id,
			})
			.where('id', '=', messageContent.id)
			.execute();

		return new Message(
			message.id as string,
			role,
			messageContent.id as string,
			0,
			content,
			generationTime,
			1,
			0,
			message.created_at as Date,
		);
	}

	public static async getById(id: string)
	{
		const message = await database.conn
			.selectFrom('messages')
			.innerJoin('message_contents', 'message_contents.id', 'messages.message_content_id')
			.select(({ selectFrom }) => [
				'messages.id as message_id',
				'role',
				'message_contents.id as content_id',
				'index',
				'content',
				'generation_time',
				'edited_by_user',
				selectFrom('message_contents')
					.select(eb => eb.fn.countAll<number>().as('content_count'))
					.whereRef('message_contents.message_id', '=', 'messages.id')
					.as('content_count'),
				'messages.created_at as created_at',
			])
			.where('messages.id', '=', id)
			.executeTakeFirst();

		if (!message) {
			return null;
		}

		return new Message(
			message.message_id as string,
			message.role as MessageRoles,
			message.content_id as string,
			message.index as number,
			message.content as string,
			message.generation_time as number,
			message.content_count as number,
			message.edited_by_user as number,
			message.created_at as Date,
		);
	}
}

export default Message;
