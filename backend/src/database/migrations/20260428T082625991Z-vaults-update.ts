
import {
	Kysely,
} from 'kysely';


async function up(db: Kysely<unknown>): Promise<void>
{
	// ALTER TABLE vaults
	await db.schema
		.alterTable('vaults')
		.addColumn('user_prompt', 'text')
		.execute();

	// ALTER TABLE chats
	await db.schema
		.alterTable('chats')
		.dropColumn('is_deleted')
		.execute();

	// ALTER TABLE message_contents
	await db.schema
		.alterTable('message_contents')
		.addColumn('edited_by_user', 'boolean', cb => cb.notNull().defaultTo(false))
		.execute();
}

async function down(db: Kysely<unknown>): Promise<void>
{
	await db.schema
		.alterTable('chats')
		.addColumn('is_deleted', 'boolean', cb => cb.notNull().defaultTo(false))
		.execute();

	await db.schema
		.alterTable('vaults')
		.dropColumn('user_prompt')
		.execute();

	await db.schema
		.alterTable('message_contents')
		.dropColumn('edited_by_user')
		.execute();
}


export {
	up,
	down,
};
