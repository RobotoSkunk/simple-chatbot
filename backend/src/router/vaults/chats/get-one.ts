
import {
	type Request,
	type Response,
} from 'express';

import Chat from '../../../entities/chat';


export default async function(req: Request, res: Response)
{
	const chatId = req.params.chatId as string;

	const chat = await Chat.getById(chatId);

	if (!chat) {
		res.json({
			error: 'Chat ID not found.',
		});
		return;
	}

	res.json({
		id: chat.id,
		name: chat.name,
		color: chat.color,
		created_at: chat.createdAt.getTime(),
		vault_id: chat.vaultId,
	});
}
