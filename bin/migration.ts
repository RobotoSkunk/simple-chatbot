import {
	join,
} from 'node:path';

const template = `import {
	SQL,
} from 'bun';

export async function up(db: SQL)
{
	// Bla bla bla some code...
}
`;

const name = process.argv[2];

if (!name || !name.match(/^[a-z0-9-]+$/)) {
	console.error('Must pass a migration name with just lowercase digits, numbers and dashes.');
	process.exit(1);
}

const rootPath = join(process.cwd(), 'src', 'database', 'migrations');
const isoDate = new Date().toISOString().replace(/[^a-z0-9]/gi, '');
const filename = `${isoDate}-${name}.ts`;

const indexFile = Bun.file(join(rootPath, 'index.ts'));
const migrationFile = Bun.file(join(rootPath, filename));

await indexFile.write(
	await indexFile.text() +
	`export * as _${isoDate} from './${filename}';\n`
);

await migrationFile.write(template);
