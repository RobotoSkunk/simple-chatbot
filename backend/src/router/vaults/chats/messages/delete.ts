
import {
	type Request,
	type Response,
} from 'express';

import Message from '../../../../entities/message';


export default async function(req: Request, res: Response)
{
	const messageId = req.params.messageId as string;

	const message = await Message.getById(messageId);

	if (!message) {
		res.status(403).json({
			error: 'Message ID not found.',
		});
		return;
	}

	await message.delete();

	res.json({
		success: true,
	});
}
