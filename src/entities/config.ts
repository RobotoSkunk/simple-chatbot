
import { sqlite } from '../database';

enum EntryDataTypes {
	STRING = 0,
	NUMBER = 1,
	BOOLEAN = 2,
}

class Config
{
	public static async getValue(key: string)
	{
		const entry = (await sqlite<{
			value: string;
			type: number;
		}[]>`SELECT value, type FROM config WHERE key = ${key}`)[0];

		if (!entry) {
			return null;
		}

		const { value, type } = entry;

		switch (type) {
			case EntryDataTypes.STRING:
				return value as string;

			case EntryDataTypes.BOOLEAN:
				return value === '1';

			case EntryDataTypes.NUMBER:
				return Number.parseInt(value as string);
		}

		return null;
	}

	public static async entryExists(key: string)
	{
		const entry = (await sqlite<{
			count: number;
		}[]>`SELECT COUNT(*) as count FROM config WHERE key = ${key}`)[0]!;

		return entry.count > 0;
	}

	public static async deleteEntry(key: string)
	{
		await sqlite`DELETE FROM config WHERE key = ${key}`;
	}

	public static async setValue(key: string, value: string | number | boolean | Date)
	{
		let type = EntryDataTypes.STRING;
		let toInsert: string = value as string;

		if (key.length === 0) {
			throw new Error(`The key has to be at least 1 character long.`);
		}

		switch (typeof value) {
			case 'string':
				type = EntryDataTypes.STRING;
				toInsert = value;
				break;
			case 'boolean':
				type = EntryDataTypes.BOOLEAN;
				toInsert = value ? '1' : '0';
				break;
			case 'number':
				type = EntryDataTypes.NUMBER;
				toInsert = value.toString();
				break;
			default:
				throw new Error(`Value of type '${typeof value}' is not allowed.`);
		}

		if (await this.entryExists(key)) {
			await sqlite`UPDATE config SET type = ${type}, value = ${toInsert} WHERE key = ${key}`;
		} else {
			await sqlite`INSERT INTO config(key, type, value) VALUES (${key}, ${type}, ${toInsert})`;
		}
	}
}

export default Config;
