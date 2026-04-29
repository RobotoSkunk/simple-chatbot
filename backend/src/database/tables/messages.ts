
export const tableName = 'messages';

export interface DB_Messages
{
	id?: string;
	role?: MessageRoles;
	chat_id?: string;
	message_content_id?: string;
	created_at?: Date;
}

export type PartialDB = {
	[ tableName ]: DB_Messages,
};
