import {
	createTray,
} from 'tray-hook';

import path from 'path';
import open from 'open';

const tray = createTray({
	autoRestart: true,
});

async function startTray(server: Bun.Server<undefined>)
{
	try {
		await tray.start();
		
		await tray.setIcon(path.join(process.cwd(), 'assets', 'icon.png'));
		await tray.setTooltip('Simple Chatbot');

		await tray.add('action-open', 'Launch UI');

		await tray.addSeparator('sp-1');
		await tray.add('action-quit', 'Quit');

		tray.on('click', async (id) =>
		{
			switch (id) {
				case 'action-open': {
					await open(`http://127.0.0.1:${server.port}/`);
					break;
				}
				case 'action-quit': {
					process.exit(0);
				}
			}
		});
	} catch (error) {
		console.error('Failed to launch tray icon.', error);
	}
}

export {
	tray,
	startTray,
};
