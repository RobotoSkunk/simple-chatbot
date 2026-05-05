
import {
	type Request,
	type Response,
} from 'express';

import Vault from '../../entities/vault';


export default async function(req: Request, res: Response)
{
	const data: {
		name: string;
	} = req.body;

	const newVault = await Vault.register(data.name, null);

	res.json({
		id: newVault.id,
		name: newVault.name,
		emote: newVault.emote,
		user_prompt: newVault.userPrompt,
		ai_model: null,
		created_at: newVault.createdAt,
	});
}
