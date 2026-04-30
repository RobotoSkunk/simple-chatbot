
import {
	type Request,
	type Response,
} from 'express';

import Message from '../../../../entities/message';


export default async function(req: Request, res: Response)
{
	const messageId = req.params.messageId as string;

	const data: {
		index: number;
	} = req.body;

	const message = await Message.getById(messageId);

	if (!message) {
		res.status(403).json({
			error: 'Message ID not found.',
		});
		return;
	}

	await message.loadContent(data.index);

	res.json({
		success: true,
		content: message.content,
		edited_by_user: message.editedByUser == 1,
	});
}
