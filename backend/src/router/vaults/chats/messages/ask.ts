
import {
	type Request,
	type Response,
} from 'express';

import {
	type Tool,
	type Message as OllamaMessage,
} from 'ollama';

import {
	model,
	ollama,
	options,
	getMainPrompt,
} from '../../../../client/ollama';

import Message from '../../../../entities/message';
import Chat from '../../../../entities/chat';


const tools: Tool[] = [
	{
		type: 'function',
		function: {
			name: 'web_search',
			description: 'Performs a web search for the given query.',
			parameters: {
				type: 'object',
				required: [ 'query' ],
				properties: {
					query: {
						type: 'string',
						description: 'The query to search on the web.',
					},
				},
			},
		},
	},
	{
		type: 'function',
		function: {
			name: 'web_fetch',
			description: 'Fetches a single page by URL.',
			parameters: {
				type: 'object',
				required: [ 'url' ],
				properties: {
					url: {
						type: 'string',
						description: 'The URL of the page to fetch.',
					},
				},
			},
		},
	},
];

export default function getAskMiddleware(isNewMessage: boolean)
{
	return async function(req: Request, res: Response)
	{
		const chatId = req.params.chatId as string;
		const messageId = req.params.messageId as string;

		const data: {
			content?: string;
		} = req.body ?? {};

		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');
		res.setHeader('X-Accel-Buffering', 'no');
		res.flushHeaders();

		const chat = await Chat.getById(chatId) as Chat;
		const vault = await chat.getVault();

		function sendDataChunk(data: ChunkResponse)
		{
			res.write(JSON.stringify(data) + '\n');
		}

		if (!chat) {
			res.status(403).json({
				error: 'Chat ID not found',
			});
			return;
		}

		let dbMessage: Message | null = null; 

		if (!isNewMessage) {
			dbMessage = await Message.getById(messageId);

			if (!dbMessage) {
				res.status(403).json({
					error: 'Message ID not found',
				});
				return;
			}
		}

		const dbMessages = await chat.loadMessages(dbMessage?.createdAt);

		const messages: OllamaMessage[] = [
			{
				role: 'system',
				content: getMainPrompt(vault?.userPrompt ?? undefined),
			},
			...dbMessages?.map((v) => ({
				role: v.role || '',
				content: v.content || '',
			})),
		];

		async function addMessage(message: OllamaMessage, totalDuration: number = 0)
		{
			const newMessage = await Message.register(
				chat.id,
				message.role as MessageRoles,
				message.content,
				totalDuration
			);

			messages.push(message);
			return newMessage;
		}

		if (data.content) {
			const newMessage = await addMessage({
				role: 'user',
				content: data.content,
			});

			sendDataChunk({
				type: 'user_message_data',
				message_id: newMessage.id,
			});
		}

		async function callFunctionAddMessage(
			name: string,
			result: string,
			thinking: string,
			args?: { [key: string]: any; })
		{
			messages.push({
				role: 'assistant',
				content: '',
				thinking,
			});

			messages.push(
				{
					role: 'tool',
					content: result,
					tool_calls: [{
						function: {
							name,
							arguments: args || {},
						},
					}],
				},
			);
		}

		let thinkingPing: NodeJS.Timeout | undefined = undefined;

		async function generate()
		{
			if (thinkingPing) {
				clearInterval(thinkingPing);
			}

			thinkingPing = setInterval(() =>
			{
				sendDataChunk({ type: 'status', status: 'thinking' });
			}, 1000);

			const stream = await ollama.chat({
				model,
				messages,
				stream: true,
				think: false,
				tools,
				options,
			});

			let thinking = '';
			let content = '';
			let totalDuration = 0;

			for await (const chunk of stream) {
				if (chunk.message.tool_calls?.length) {
					const call = chunk.message.tool_calls[0];
					const name = call.function.name;

					switch (name) {
						case 'web_search': {
							const arg = call.function.arguments as { query: string };
							sendDataChunk({ type: 'status', status: 'web_search' });

							try {
								const searchResponse = await ollama.webSearch({
									query: arg.query,
									maxResults: 5,
								});

								await callFunctionAddMessage(name, JSON.stringify(searchResponse), thinking, call.function.arguments);
							} catch (error) {
								console.error(error);

								await callFunctionAddMessage(name, JSON.stringify({
									error: 'something went wrong when trying to execute web_search'
								}), thinking, call.function.arguments);
							} finally {
								await generate();
							}
							break;
						}

						case 'web_fetch': {
							const arg = call.function.arguments as { url: string };
							sendDataChunk({ type: 'status', status: 'web_search' });

							try{
								const searchResponse = await ollama.webFetch({
									url: arg.url,
								});

								await callFunctionAddMessage(name, JSON.stringify(searchResponse), thinking, call.function.arguments);
							} catch (error) {
								console.error(error);

								await callFunctionAddMessage(name, JSON.stringify({
									error: 'something went wrong when trying to execute web_fetch'
								}), thinking, call.function.arguments);
							} finally {
								await generate();
							}
							break;
						}
					}

					return;
				}


				if (chunk.message.thinking) {
					thinking += chunk.message.thinking;
					sendDataChunk({ type: 'status', status: 'thinking' });
				}

				if (chunk.message.content) {
					const token = chunk.message.content;

					content += token;
					sendDataChunk({ type: 'writing', token });

					if (thinkingPing) {
						clearInterval(thinkingPing);
					}
				}

				if (chunk.done) {
					totalDuration = chunk.total_duration;
				}
			}


			if (isNewMessage) {
				let newMessage = 'no-response';

				if (content.length > 0) {
					const tmpMessage = await addMessage({
						role: 'assistant',
						content,
					});

					newMessage = tmpMessage.id;
				}

				sendDataChunk({
					type: 'end',
					elapsed_time: totalDuration,
					message_id: newMessage,
				});
			} else if (dbMessage) {
				let newContent = content.length > 0 ? content : '[No response]';
				dbMessage.updateMessage(newContent, totalDuration, false);

				sendDataChunk({
					type: 'end',
					elapsed_time: totalDuration,
					message_id: dbMessage.id,
				});
			}
		}

		await generate();
		res.end();

		if (thinkingPing) {
			clearInterval(thinkingPing);
		}
	}
}
