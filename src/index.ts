import path from 'path';

import api from './api';
import { startTray } from './tray';

import webapp from '@web/index.html';

const app = Bun.serve({
	routes: {
		'/*': webapp,
		'/api/*': api.handle,
		'/favicon.ico': Bun.file(path.join(process.cwd(), 'web', 'favicon.ico')),
	},
});

await startTray(app);
console.log(`Server running at http://127.0.0.1:${app.port}`);
