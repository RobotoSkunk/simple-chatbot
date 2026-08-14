import {
	SQL,
} from 'bun';

export async function up(db: SQL)
{
	await db`CREATE TABLE config (
		key TEXT NOT NULL PRIMARY KEY,
		value TEXT NOT NULL,
		type INTEGER NOT NULL
	)`;

	await db`CREATE TABLE vaults (
		id TEXT NOT NULL PRIMARY KEY,
		name TEXT NOT NULL,
		user_prompt TEXT,
		ai_model TEXT
	)`;

	await db`CREATE TABLE allowed_directories (
		id TEXT NOT NULL PRIMARY KEY,
		pathname TEXT NOT NULL,

		vault_id TEXT NOT NULL REFERENCES vaults(id) ON DELETE CASCADE
	)`;

	await db`CREATE TABLE chats (
		id TEXT NOT NULL PRIMARY KEY,
		name TEXT NOT NULL,
		created_at TEXT NOT NULL,
		sort_index INTEGER NOT NULL,

		vault_id TEXT NOT NULL REFERENCES vaults(id) ON DELETE CASCADE
	)`;

	await db`CREATE TABLE messages (
		id TEXT NOT NULL PRIMARY KEY,
		role TEXT NOT NULL,
		current_index INTEGER NOT NULL,
		created_at TEXT NOT NULL,
		sort_index INTEGER NOT NULL,

		chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE
	)`;

	await db`CREATE TABLE message_contents (
		id TEXT NOT NULL PRIMARY KEY,
		_index INTEGER NOT NULL,
		content TEXT,
		created_at TEXT NOT NULL,

		message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE
	)`;

	await db`CREATE TABLE message_content_files (
		id TEXT NOT NULL PRIMARY KEY,
		mime TEXT NOT NULL,
		content TEXT NOT NULL,
		created_at TEXT NOT NULL,

		message_content_id TEXT NOT NULL REFERENCES message_contents(id) ON DELETE CASCADE
	)`;

	await db`CREATE TABLE message_content_items (
		id TEXT NOT NULL PRIMARY KEY,
		type TEXT NOT NULL,
		content TEXT NOT NULL,
		tokens_count TEXT NOT NULL,
		time TEXT NOT NULL,
		created_at TEXT NOT NULL,

		message_content_id TEXT NOT NULL REFERENCES message_contents(id) ON DELETE CASCADE
	)`;
}
