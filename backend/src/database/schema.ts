
import {
	Kysely,
} from 'kysely';

import * as allowed_directories from './tables/allowed-directories';
import * as chats from './tables/chats';
import * as config from './tables/config';
import * as message_contents from './tables/message-contents';
import * as messages from './tables/messages';
import * as vaults from './tables/vaults';


type DatabaseSchemaType =
	allowed_directories.PartialDB &
	chats.PartialDB &
	config.PartialDB &
	message_contents.PartialDB &
	messages.PartialDB &
	vaults.PartialDB;

type DatabaseSchema = Kysely<DatabaseSchemaType>;


export {
	DatabaseSchemaType,
	DatabaseSchema,
};

export default DatabaseSchema;

