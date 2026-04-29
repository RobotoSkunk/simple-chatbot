
import {
	Pool,
} from 'pg';

import {
	Kysely,
	Migrator,
	PostgresDialect,
	sql,
} from 'kysely';

import {
	DatabaseSchemaType,
	DatabaseSchema,
} from './schema';

import {
	ContextMigrationProvider,
} from './migrations/provider';


import * as migrations from './migrations';


class Database
{
	/**
	 * Database connection pool
	 */
	private pool: Pool;

	/**
	 * Kysely connection
	 */
	private db: DatabaseSchema;

	/**
	 * Kysely migrator
	 */
	private migrator: Migrator;


	/**
	 * Create a new database connection pool based on environment variables
	 */
	constructor()
	{
		this.pool = new Pool({
			database: process.env.DB_NAME,
			host: process.env.DB_HOST,
			password: process.env.DB_PASSWORD,
			port: Number.parseInt(process.env.DB_PORT ?? '5432'),
			user: process.env.DB_USER,
		});

		const dialect = new PostgresDialect({ pool: this.pool });
		this.db = new Kysely<DatabaseSchemaType>({ dialect });

		this.migrator = new Migrator({
			db: this.db,
			provider: new ContextMigrationProvider(migrations, 'pg')
		})
	}

	/**
	 * Test the database connection.
	 */
	public async testConnection(): Promise<void>
	{
		try {
			sql<string>`SELECT NOW()`;

			console.log('Connected to database.');

		} catch (error) {
			console.error('An error ocurred while trying to test database connection.');
			throw error;
		}
	}

	/**
	 * Just a wrapper of migrateTo but with try/catch compatibility.
	 */
	public async tryMigrateTo(migration: string)
	{
		const { error, results } = await this.migrator.migrateTo(migration);
		
		if (error) {
			throw error;
		}

		if (!results) {
			throw new Error('An unknown error ocurred while migrating.');
		}

		return results;
	}


	/**
	 * Just a wrapper of migrateToLatest but with try/catch compatibility.
	 */
	public async tryMigrateToLatest()
	{
		const { error, results } = await this.migrator.migrateToLatest();
		
		if (error) {
			throw error;
		}

		if (!results) {
			throw new Error('An unknown error ocurred while migrating.');
		}

		return results;
	}

	public get conn()
	{
		return this.db;
	}
}


export default Database;
