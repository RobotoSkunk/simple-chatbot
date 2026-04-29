
import 'source-map-support';
import 'dotenv/config';

import {
	app,
} from './client/express';

import {
	router,
} from './router';

import {
	ollama,
	model,
} from './client/ollama';

import database from './client/database';


(async () =>
{
	try {
		await database.tryMigrateToLatest();
		await database.prepare();

	} catch (error) {
		console.error(error);
		process.exit(2);
	}

	app.use(router);

	app.listen(5080, (error) =>
	{
		if (error) {
			console.error(error);
			return;
		}

		console.info('Backend ready.');

		(async () => await ollama.chat({ model }))();
	});
})();
