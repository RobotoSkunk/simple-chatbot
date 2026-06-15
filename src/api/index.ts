import {
	Elysia,
	t,
} from 'elysia';

import ollama from 'ollama';

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
	);

export default api;
