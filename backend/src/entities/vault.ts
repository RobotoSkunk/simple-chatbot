
import {
	ollama,
} from '../client/ollama';

import database from '../client/database';
import Chat from './chat';

class Vault
{
	private _id: string;
	public name: string;
	public emote: string | null;
	public userPrompt: string | null;
	public _aiModel: string | null;
	public createdAt: Date;

	constructor(
		id: string,
		name: string,
		emote: string | null,
		userPrompt: string | null,
		aiModel: string | null,
		createdAt: Date)
	{
		this._id = id;
		this.name = name;
		this.emote = emote;
		this.userPrompt = userPrompt;
		this._aiModel = aiModel;
		this.createdAt = createdAt;
	}

	public get id()
	{
		return this._id;
	}

	public async setAiModel(model: string)
	{
		this._aiModel = await this._parseModel(model);
	}

	public async getAiModel()
	{
		return await this._parseModel(this._aiModel ?? '');
	}

	private async _parseModel(model: string)
	{
		const { models } = await ollama.list();
		const modelIndex = models.findIndex((m) => m.model === model);

		if (modelIndex >= 0) {
			return model;
		}

		return models[0].model ?? '';
	}

	public async syncToDatabase()
	{
		await database.conn
			.updateTable('vaults')
			.set({
				name: this.name,
				emote: this.emote,
				user_prompt: this.userPrompt,
				ai_model: await this.getAiModel(),
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

		return new Vault(id as string, name, emote, null, null, created_at as Date);
	}

	public static async getAll()
	{
		const vaults = await database.conn
			.selectFrom('vaults')
			.selectAll()
			.orderBy('created_at', 'asc')
			.execute();

		return vaults.map(({ id, name, emote, user_prompt, ai_model, created_at }) => new Vault(
			id as string,
			name as string,
			emote as string | null,
			user_prompt as string | null,
			ai_model as string | null,
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
			vault.ai_model as string | null,
			vault.created_at as Date,
		);
	}
}

export default Vault;
