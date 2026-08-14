import {
	SQL,
} from 'bun';

import fs from 'node:fs/promises';
import path from 'node:path';

import * as migrations from './migrations';

interface Migration
{
	up(db: SQL): Promise<void>;
}


const confPath = path.join(process.env.HOME!, '.config', 'simple-chatbot');

if (!(await fs.exists(confPath))) {
	await fs.mkdir(confPath, { recursive: true });
}


export const sqlite = new SQL(`sqlite://${confPath}/db.sqlite`, {
	strict: true,
});
await sqlite`PRAGMA journal_mode = WAL`;
await sqlite`PRAGMA foreign_keys = ON`;


export async function migrateDatabase()
{
	let dbVersion = (await sqlite<{ user_version: number }[]>`PRAGMA user_version`)[0]!.user_version;
	const entries = Object.entries(migrations as Record<string, Migration>);

	for (let i = dbVersion; i < entries.length; i++) {
		try {
			await entries[i]![1].up(sqlite);
		} catch (e) {
			throw e;
		}
	}

	await sqlite.unsafe(`PRAGMA user_version = ${entries.length}`);
}
