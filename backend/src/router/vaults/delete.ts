
import {
	type Request,
	type Response,
} from 'express';

import Vault from '../../entities/vault';


export default async function(req: Request, res: Response)
{
	const vaultId = req.params.vaultId as string;
	const vault = await Vault.getById(vaultId);

	if (!vault) {
		res.status(403).json({
			error: 'Vault ID not found.',
		});
		return;
	}

	await vault.delete();

	res.json({
		success: true,
	});
}
