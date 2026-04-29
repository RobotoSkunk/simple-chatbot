
import {
	type Request,
	type Response,
} from 'express';

import Chat from '../../../../entities/chat';


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

	const messages = await chat.loadMessages();


	res.json(
		messages.map((message) =>
		({
			id: message.id,
			role: message.role,
			index: message.index,
			content: message.content,
			generation_time: message.generationTime,
			content_count: message.contentCount,
			created_at: message.createdAt,
		}))
	);
}
