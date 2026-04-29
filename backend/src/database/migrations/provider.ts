
import {
	Kysely,
	Migration,
	MigrationProvider,
} from 'kysely';


interface ContextMigration<T>
{
	up(db: Kysely<unknown>, ctx: T): Promise<void>;
	down?(db: Kysely<unknown>, ctx: T): Promise<void>;
}


class ContextMigrationProvider<T> implements MigrationProvider
{
	private migrations: Record<string, ContextMigration<T>>;
	private context: T;

	constructor(migrations: Record<string, ContextMigration<T>>, context: T)
	{
		this.migrations = migrations;
		this.context = context;
	}


	public async getMigrations(): Promise<Record<string, Migration>>
	{
		const contextMigrations: Record<string, Migration> = {};

		for (const [ name, migration ] of Object.entries(this.migrations)) {
			contextMigrations[name] = {
				up: async (db) => await migration.up(db, this.context),
				down: async (db) => migration.down ? await migration.down(db, this.context) : undefined,
			};
		}

		return contextMigrations;
	}
}


export {
	ContextMigration,
	ContextMigrationProvider,
};
