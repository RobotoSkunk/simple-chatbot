import { Elysia } from 'elysia';

import indexHTML from '@web/index.html';

export const app = new Elysia()
	.get('/', { message: 'Something over here!' })
	.get('/user', { name: 'Pablo', lastname: 'Contreras' })
	.get('/password', { error: 'Wrong password.' })
	.listen(8085, () => console.log('Elysia is ready!'));

Bun.serve({
	port: 8080,
	routes: {
		'/*': indexHTML,
	},
});

console.log('Bun is ready!');
