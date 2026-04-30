
import database from '../client/database';
import Message from './message';
import Vault from './vault';

class Chat
{
	private _id: string;
	public name: string;
	private _color: number;
	public createdAt: Date;
	private _vaultId: string;

	constructor(
		id: string,
		name: string,
		color: number,
		createdAt: Date,
		vaultId: string)
	{
		this._id = id;
		this.name = name;
		this._color = color;
		this.createdAt = createdAt;
		this._vaultId = vaultId;
	}

	public get id()
	{
		return this._id;
	}

	public get color()
	{
		return this._color;
	}

	public get vaultId()
	{
		return this._vaultId;
	}

	public set color(newColor: number)
	{
		this._color = newColor;
	}

	public async syncToDatabase()
	{
		await database.conn
			.updateTable('chats')
			.set({
				name: this.name,
				color: this._color,
			})
			.execute();
	}

	public async delete()
	{
		await database.conn
			.deleteFrom('chats')
			.where('id', '=', this.id)
			.execute();
	}

	public async loadMessages(from: Date = new Date())
	{
		const messages = await database.conn
			.selectFrom('messages')
			.innerJoin('message_contents', 'message_contents.id', 'messages.message_content_id')
			.select(({ selectFrom }) => [
				'messages.id as message_id',
				'role',
				'message_contents.id as content_id',
				'index',
				'content',
				'generation_time',
				selectFrom('message_contents')
					.select(eb => eb.fn.countAll<number>().as('content_count'))
					.whereRef('message_contents.message_id', '=', 'messages.id')
					.as('content_count'),
				'messages.created_at as created_at',
			])
			.where('chat_id', '=', this._id)
			.where('messages.created_at', '<', from)
			.orderBy('messages.created_at', 'asc')
			.execute();

		return messages.map(({
			message_id,
			role,
			content_id,
			index,
			content,
			generation_time,
			content_count,
			created_at,
		}) => new Message(
			message_id as string,
			role as MessageRoles,
			content_id as string,
			index as number,
			content as string,
			generation_time as number,
			content_count as number,
			created_at as Date,
		));
	}

	public async getVault()
	{
		return await Vault.getById(this._vaultId);
	}

	public static async register(vaultId: string, name: string, color: number)
	{
		const { id, created_at } = await database.conn
			.insertInto('chats')
			.values({
				name,
				color,
				vault_id: vaultId,
			})
			.returning([ 'id', 'created_at' ])
			.executeTakeFirstOrThrow();

		return new Chat(id as string, name, color, created_at as Date, vaultId);
	}

	public static async getAllFromVault(vaultId: string)
	{
		const chats = await database.conn
			.selectFrom('chats')
			.select([
				'id',
				'name',
				'color',
				'created_at',
			])
			.where('vault_id', '=', vaultId)
			.orderBy('created_at', 'asc')
			.execute();

		return chats.map(({ id, name, color, created_at }) => new Chat(
			id as string,
			name as string,
			color as number,
			created_at as Date,
			vaultId as string,
		));
	}

	public static async getById(id: string)
	{
		const chat = await database.conn
			.selectFrom('chats')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();

		if (!chat) {
			return null;
		}

		return new Chat(
			chat.id as string,
			chat.name as string,
			chat.color as number,
			chat.created_at as Date,
			chat.vault_id as string,
		);
	}
}

export default Chat;
