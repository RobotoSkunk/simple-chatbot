
export const tableName = 'config';

export interface DB_Config
{
	key?: string;
	value?: string;
	type?: number;
}

export type PartialDB = {
	[ tableName ]: DB_Config,
};
