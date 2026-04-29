
import {
	type Request,
	type Response,
} from 'express';

import Chat from '../../../entities/chat';


export default async function(req: Request, res: Response)
{
	const vaultId = req.params.vaultId as string;

	const chats = await Chat.getAllFromVault(vaultId);

	res.json(
		chats.map((chat) =>
		({
			id: chat.id,
			name: chat.name,
			color: chat.color,
			created_at: chat.createdAt.getTime(),
		}))
	);
}
