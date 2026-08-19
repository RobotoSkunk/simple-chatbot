import {
	Elysia,
	t,
} from 'elysia';

import Config from '../entities/config';

const routesAuth = new Elysia({ prefix: '/auth' })
	.post('/register', async ({ body }) =>
	{
		if (await Config.entryExists('password')) {
			return {
				success: false,
				message: `A password had already been registered.`,
			};
		}

		const passwordHash = await Bun.password.hash(body.password);

		await Config.setValue('password', passwordHash);
		await Config.setValue('encryption-key', body.encryptionKey);
		await Config.setValue('salt', body.salt);

		return {
			success: true,
		};
	}, {
		body: t.Object({
			password: t.String(),
			encryptionKey: t.String(),
			salt: t.String(),
		}),
	})
	.get('/identity', async () =>
	{
		const encryptionKey = await Config.getValue('encryption-key');
		const salt = await Config.getValue('salt');

		return {
			encryptionKey,
			salt,
		};
	})
;

export default routesAuth;
