
import database from '../client/database';
import Chat from './chat';

class Vault
{
	private _id: string;
	public name: string;
	public emote: string | null;
	public userPrompt: string | null;
	public createdAt: Date;

	constructor(id: string, name: string, emote: string | null, userPrompt: string | null, createdAt: Date)
	{
		this._id = id;
		this.name = name;
		this.emote = emote;
		this.userPrompt = userPrompt;
		this.createdAt = createdAt;
	}

	public get id()
	{
		return this._id;
	}

	public async syncToDatabase()
	{
		await database.conn
			.updateTable('vaults')
			.set({
				name: this.name,
				emote: this.emote,
				user_prompt: this.userPrompt,
			})
			.where('id', '=', this._id)
			.execute();
	}

	public async getChats()
	{
		await Chat.getAllFromVault(this._id);
	}

	public static async register(name: string, emote: string | null)
	{
		const { id, created_at } = await database.conn
			.insertInto('vaults')
			.values({
				name,
				emote,
			})
			.returning([ 'id', 'created_at' ])
			.executeTakeFirstOrThrow();

		return new Vault(id as string, name, emote, null, created_at as Date);
	}

	public static async getAll()
	{
		const vaults = await database.conn
			.selectFrom('vaults')
			.selectAll()
			.execute();

		return vaults.map(({ id, name, emote, user_prompt, created_at }) => new Vault(
			id as string,
			name as string,
			emote as string | null,
			user_prompt as string | null,
			created_at as Date,
		));
	}

	public static async getById(id: string)
	{
		const vault = await database.conn
			.selectFrom('vaults')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst();

		if (!vault) {
			return null;
		}

		return new Vault(
			vault.id as string,
			vault.name as string,
			vault.emote as string | null,
			vault.user_prompt as string | null,
			vault.created_at as Date,
		);
	}
}

export default Vault;
