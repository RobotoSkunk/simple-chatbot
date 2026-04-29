#!/usr/bin/env ts-node

import fs from 'fs/promises';
import path from 'path';

// The code here is based from the atproto package developers code, their job is amazing <3
// https://github.com/bluesky-social/atproto/blob/main/packages/bsky/bin/migration-create.ts

const now = new Date();

const template = `
import {
	Kysely,
} from 'kysely';


async function up(db: Kysely<unknown>): Promise<void>
{
	// Migration code
}

async function down(db: Kysely<unknown>): Promise<void>
{
	// Migration code
}


export {
	up,
	down,
};
`;

(async () =>
{
	const name = process.argv[2];

	if (!name || !name.match(/^[a-z0-9-]+$/)) {
		console.error('Must pass a migration name with just lowercase digits, numbers and dashes.');
		process.exit(1);
	}

	const prefix = now.toISOString().replace(/[^a-z0-9]/gi, ''); // Added .replace for Windows compatibility :)

	const filename = `${prefix}-${name}`;
	const outputDir = path.join(process.cwd(), 'backend', 'src', 'database', 'migrations');

	await fs.writeFile(path.join(outputDir, `${filename}.ts`), template, { flag: 'wx' });

	await fs.writeFile(
		path.join(outputDir, 'index.ts'),
		`export * as _${prefix} from './${filename}';\n`,
		{ flag: 'a' }
	);
})();
