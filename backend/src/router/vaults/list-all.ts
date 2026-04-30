
import {
	type Request,
	type Response,
} from 'express';

import Vault from '../../entities/vault';


export default async function(req: Request, res: Response)
{
	const vaults = await Vault.getAll();

	res.json(
		vaults.map((vault) =>
		({
			id: vault.id,
			name: vault.name,
			emote: vault.emote,
			user_prompt: vault.userPrompt,
			created_at: vault.createdAt.getTime(),
		}))
	);
}
