import {
	Elysia,
	t,
} from 'elysia';

import Config from '../entities/config';

const routesAuth = new Elysia({ prefix: '/auth' })
	.post('/register', async ({ body }) =>
	{
		if (await Config.entryExists('password-exists')) {
			return {
				success: false,
				message: `A password had already been registered.`,
			};
		}

		await Config.setValue('password-salt',   body.passwordSalt);
		await Config.setValue('srp-verifier',    body.srpVerifier);
		await Config.setValue('srp-salt',        body.srpSalt);
		await Config.setValue('dek',             body.dek);
		await Config.setValue('kek-salt',        body.kekSalt);
		await Config.setValue('password-exists', true);

		return {
			success: true,
		};
	}, {
		body: t.Object({
			passwordSalt: t.String(),
			srpVerifier: t.String(),
			srpSalt: t.String(),
			dek: t.String(),
			kekSalt: t.String(),
		}),
	})
	.get('/identity', async () =>
	{
		const dek = await Config.getValue('dek');
		const kekSalt = await Config.getValue('kek-salt');

		return {
			dek,
			kekSalt,
		};
	})
;

export default routesAuth;
