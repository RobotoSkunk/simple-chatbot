
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
		res.status(403).json({
			error: 'Chat ID not found.',
		});
		return;
	}

	await chat.delete();

	res.json({
		success: true,
	});
}
