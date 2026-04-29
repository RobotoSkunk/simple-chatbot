
import {
	type Request,
	type Response,
} from 'express';

import Vault from '../../entities/vault';


export default async function(req: Request, res: Response)
{
	const data: {
		name: string;
		emote: string;
	} = req.body;

	const newVault = await Vault.register(data.name, data.emote);

	res.json({
		id: newVault.id,
		name: newVault.name,
		emote: newVault.emote,
		created_at: newVault.createdAt,
	});
}
