import { Elysia } from 'elysia';
import { staticPlugin } from '@elysia/static';

export const app = new Elysia()
	.use(
		await staticPlugin({
			prefix: '/',
			assets: 'web',
			bunFullstack: true,
		}
	))
	.listen(3000, () => console.log('Running!'));
