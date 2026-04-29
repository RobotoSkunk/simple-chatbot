
export const tableName = 'message_contents';

export interface DB_MessageContents
{
	id?: string;
	message_id?: string;
	index?: number;
	content?: string;
	generation_time?: number;
	edited_by_user?: number;
	created_at?: Date;
}

export type PartialDB = {
	[ tableName ]: DB_MessageContents,
};
