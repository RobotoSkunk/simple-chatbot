
export const tableName = 'chats';

export interface DB_Chats
{
	id?: string;
	name?: string;
	color?: number;
	created_at?: Date;
	vault_id?: string;
}

export type PartialDB = {
	[ tableName ]: DB_Chats,
};
