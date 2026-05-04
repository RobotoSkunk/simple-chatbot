
export const tableName = 'vaults';

export interface DB_Vaults
{
	id?: string;
	name?: string;
	emote?: string | null;
	created_at?: Date;
	user_prompt?: string | null;
	ai_model?: string | null;
}

export type PartialDB = {
	[ tableName ]: DB_Vaults,
};
