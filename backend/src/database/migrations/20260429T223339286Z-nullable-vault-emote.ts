
import {
	Kysely,
} from 'kysely';


async function up(db: Kysely<unknown>): Promise<void>
{
	// ALTER TABLE vaults
	await db.schema
		.alterTable('vaults')
		.alterColumn('emote', al => al.dropNotNull())
		.execute();
}

async function down(db: Kysely<unknown>): Promise<void>
{
	await db.schema
		.alterTable('vaults')
		.alterColumn('emote', al => al.setNotNull())
		.execute();
}


export {
	up,
	down,
};
