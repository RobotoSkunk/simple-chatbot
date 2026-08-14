import path from 'path';

import api from './api';
import { startTray } from './tray';

import { migrateDatabase } from './database';

import webapp from '../web/index.html';

const app = Bun.serve({
	routes: {
		'/*': webapp,
		'/api/*': api.handle,
		'/favicon.ico': Bun.file(path.join(process.cwd(), 'web', 'favicon.ico')),
	},
	idleTimeout: 60,
	development: true,
});

// await startTray(app);
await migrateDatabase();
console.log(`Server running at http://127.0.0.1:${app.port}`);
