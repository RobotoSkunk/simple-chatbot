
export const tableName = 'vaults';

export interface DB_Vaults
{
	id?: string;
	name?: string;
	emote?: string;
	created_at?: Date;
	user_prompt?: string | null;
}

export type PartialDB = {
	[ tableName ]: DB_Vaults,
};
