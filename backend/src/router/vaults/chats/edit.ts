
import {
	type Request,
	type Response,
} from 'express';

import Chat from '../../../entities/chat';


export default async function(req: Request, res: Response)
{
	const chatId = req.params.chatId as string;

	const data: {
		name: string;
	} = req.body;


	const chat = await Chat.getById(chatId);

	if (!chat) {
		res.status(403).json({
			error: 'Chat ID not found.',
		});
		return;
	}

	if (data.name) {
		chat.name = data.name;
	}

	await chat.syncToDatabase();

	res.json({
		success: true,
	});
}
