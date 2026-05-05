
import {
	type Request,
	type Response,
} from 'express';

import Vault from '../../entities/vault';


export default async function(req: Request, res: Response)
{
	const vaults = await Vault.getAll();
	const mappedVaults: object[] = [];

	for (const vault of vaults) {
		mappedVaults.push({
			id: vault.id,
			name: vault.name,
			emote: vault.emote,
			user_prompt: vault.userPrompt,
			ai_model: await vault.getAiModel(),
			created_at: vault.createdAt.getTime(),
		});
	}

	res.json(mappedVaults);
}
