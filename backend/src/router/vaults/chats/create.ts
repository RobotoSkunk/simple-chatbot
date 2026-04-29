
import {
	type Request,
	type Response,
} from 'express';

import {
	model,
	options,
	ollama,
} from '../../../client/ollama';

import Chat from '../../../entities/chat';


const prompt =
`Generate a short description name (50 characters maximum) of the context for the session based on user's input.

Don't write quotes. Don't use emojis.`;

export default async function(req: Request, res: Response)
{
	const vaultId = req.params.vaultId as string;
	console.log(vaultId);

	const data: {
		content: string;
	} = req.body;

	const color = Math.floor(Math.random() * 0xffffff);

	const response = await ollama.chat({
		model,
		options,
		messages: [
			{
				role: 'system',
				content: prompt,
			},
			{
				role: 'user',
				content: data.content,
			}
		],
		think: false,
		stream: false,
	});


	const newChat = await Chat.register(vaultId, response.message.content, color);

	res.json({
		id: newChat.id,
		name: newChat.name,
		color: newChat.color,
		created_at: newChat.createdAt,
	});
}
