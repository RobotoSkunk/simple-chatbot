import { Elysia } from 'elysia';
import { staticPlugin } from '@elysia/static';

const authApp = new Elysia()
	.onBeforeHandle(() => console.log('Handled!'))
	.get('/something', () => new Response('Check the output!'));

export const app = new Elysia()
	.use(
		await staticPlugin({
			prefix: '/',
			assets: 'web',
			bunFullstack: true,
		}
	))
	.listen(8080, () => console.log('Running!'));
