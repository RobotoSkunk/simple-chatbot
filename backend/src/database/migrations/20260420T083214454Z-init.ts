
import {
	Kysely,
	sql,
} from 'kysely';


async function up(db: Kysely<unknown>): Promise<void>
{
	// CREATE vaults
	await db.schema
		.createTable('vaults')
		.addColumn('id', 'uuid', cb => cb.primaryKey().defaultTo(sql`GEN_RANDOM_UUID()`))
		.addColumn('name', 'text', cb => cb.notNull())
		.addColumn('emote', 'text', cb => cb.notNull())
		.addColumn('created_at', 'timestamp', cb => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.execute();

	// CREATE chats
	await db.schema
		.createTable('chats')
		.addColumn('id', 'uuid', cb => cb.primaryKey().defaultTo(sql`GEN_RANDOM_UUID()`))
		.addColumn('name', 'text', cb => cb.notNull())
		.addColumn('color', 'integer', cb => cb.notNull().defaultTo(0x000000))
		.addColumn('is_deleted', 'boolean', cb => cb.notNull().defaultTo(false))
		.addColumn('created_at', 'timestamp', cb => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn('vault_id', 'uuid', cb => cb.notNull())

		.addForeignKeyConstraint('fk_chats_vault_id', [ 'vault_id' ], 'vaults', [ 'id' ], cb => cb.onDelete('cascade'))
		.execute();

	// CREATE messages
	await db.schema
		.createTable('messages')
		.addColumn('id', 'uuid', cb => cb.primaryKey().defaultTo(sql`GEN_RANDOM_UUID()`))
		.addColumn('role', 'text', cb => cb.notNull())
		.addColumn('chat_id', 'uuid', cb => cb.notNull())
		.addColumn('message_content_id', 'uuid', cb => cb.notNull())
		.addColumn('created_at', 'timestamp', cb => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

		.addForeignKeyConstraint('fk_chats_chat_id', [ 'chat_id' ], 'chats', [ 'id' ], cb => cb.onDelete('cascade'))
		.execute();

	// CREATE message_contents
	await db.schema
		.createTable('message_contents')
		.addColumn('id', 'uuid', cb => cb.primaryKey().defaultTo(sql`GEN_RANDOM_UUID()`))
		.addColumn('message_id', 'uuid')
		.addColumn('index', 'smallint', cb => cb.notNull().defaultTo(0))
		.addColumn('content', 'text', cb => cb.notNull())
		.addColumn('generation_time', 'integer', cb => cb.notNull())
		.addColumn('created_at', 'timestamp', cb => cb.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))

		.addForeignKeyConstraint('fk_message_contents_message_id', [ 'message_id' ], 'messages', [ 'id' ], cb => cb.onDelete('cascade'))
		.execute();

	// FOREIGN KEY messages.message_content_id -> message_contents.id
	await db.schema
		.alterTable('messages')
		.addForeignKeyConstraint('fk_messages_content_id', [ 'message_content_id' ], 'message_contents', [ 'id' ], cb => cb.onDelete('cascade'))
		.execute();
}

async function down(db: Kysely<unknown>): Promise<void>
{
	await db.schema
		.dropTable('vaults')
		.cascade()
		.execute();

	await db.schema
		.dropTable('chats')
		.cascade()
		.execute();

	await db.schema
		.dropTable('messages')
		.cascade()
		.execute();

	await db.schema
		.dropTable('message_contents')
		.cascade()
		.execute();
}


export {
	up,
	down,
};
