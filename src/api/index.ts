import {
	Elysia,
	t,
} from 'elysia';

import ollama from 'ollama';
import Config from '../entities/config';

const api = new Elysia({ prefix: '/api' })
	.post('/ask', async function*({ set, body, request })
		{
			set.headers['content-type'] = 'text/plain';

			const stream = await ollama.generate({
				model: 'qwen3.5',
				prompt: body.question,
				stream: true,
				think: false,
			});

			for await (const chunk of stream) {
				if (request.signal.aborted) {
					stream.abort();
					break;
				}

				yield {
					data: chunk.response,
				};
				yield '\0';
			}
		},
		{
			body: t.Object({
				question: t.Readonly(t.String()),
			}),
		}
	)
	.get('/identity', async () =>
	{
		const encryptionKey = await Config.getValue('encryption-key');

		return {
			encryptionKey,
		};
	})
;

export default api;
