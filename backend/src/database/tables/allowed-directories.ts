
export const tableName = 'allowed_directories';

export interface DB_AllowedDirectories
{
	id?: string;
	pathname?: string;
	vault_id?: string | null;
	created_at?: Date;
}

export type PartialDB = {
	[ tableName ]: DB_AllowedDirectories,
};
