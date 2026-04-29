
import {
	Kysely,
} from 'kysely';

import * as chats from './tables/chats';
import * as message_contents from './tables/message-contents';
import * as messages from './tables/messages';
import * as vaults from './tables/vaults';


type DatabaseSchemaType =
	chats.PartialDB &
	message_contents.PartialDB &
	messages.PartialDB &
	vaults.PartialDB;

type DatabaseSchema = Kysely<DatabaseSchemaType>;


export {
	DatabaseSchemaType,
	DatabaseSchema,
};

export default DatabaseSchema;

