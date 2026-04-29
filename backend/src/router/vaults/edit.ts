
import {
	type Request,
	type Response,
} from 'express';

import Vault from '../../entities/vault';


export default async function(req: Request, res: Response)
{
	const vaultId = req.params.vaultId as string;

	const data: {
		name?: string;
		emote?: string;
	} = req.body;

	const vault = await Vault.getById(vaultId);

	if (!vault) {
		res.status(403).json({
			error: 'Vault ID not found.',
		});
		return;
	}

	if (data.name) {
		vault.name = data.name;
	}

	if (data.emote) {
		vault.emote = data.emote;
	}

	await vault.syncToDatabase();

	res.json({
		success: true,
	});
}
