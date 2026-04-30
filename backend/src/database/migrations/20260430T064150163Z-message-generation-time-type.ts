
import {
	Kysely,
} from 'kysely';


async function up(db: Kysely<unknown>): Promise<void>
{
	// ALTER TABLE message_contents
	await db.schema
		.alterTable('message_contents')
		.alterColumn('generation_time', al => al.setDataType('bigint'))
		.execute();
}

async function down(db: Kysely<unknown>): Promise<void>
{
	await db.schema
		.alterTable('message_contents')
		.alterColumn('generation_time', al => al.setDataType('integer'))
		.execute();
}


export {
	up,
	down,
};
