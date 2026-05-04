
import {
	Kysely,
	sql,
} from 'kysely';


async function up(db: Kysely<unknown>): Promise<void>
{
	// ALTER TABLE vaults
	await db.schema
		.alterTable('vaults')
		.addColumn('ai_model', 'text')
		.execute();

	// CREATE TABLE allowed_directories
	await db.schema
		.createTable('allowed_directories')
		.addColumn('id', 'uuid', cb => cb.primaryKey().defaultTo(sql`GEN_RANDOM_UUID()`))
		.addColumn('pathname', 'text', cb => cb.notNull())
		.addColumn('vault_id', 'uuid', cb => cb.notNull())
		.addColumn('created_at', 'timestamp', cb => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

		.addForeignKeyConstraint('fk_vaults_vault_id', [ 'vault_id' ], 'vaults', [ 'id' ], fk => fk.onDelete('cascade'))
		.execute();

	// CREATE TABLE config
	await db.schema
		.createTable('config')
		.addColumn('key', 'text', cb => cb.primaryKey())
		.addColumn('value', 'text', cb => cb.notNull())
		.addColumn('type', 'smallint', cb => cb.notNull())
		.execute();
}

async function down(db: Kysely<unknown>): Promise<void>
{
	await db.schema
		.alterTable('vaults')
		.dropColumn('ai_model')
		.execute();

	await db.schema
		.dropTable('allowed_directories')
		.execute();

	await db.schema
		.dropTable('config')
		.execute();
}


export {
	up,
	down,
};
