
import database from '../client/database';

enum EntryDataTypes {
	STRING = 0,
	NUMBER = 1,
	BOOLEAN = 2,
	DATE = 3,
}

class Config
{
	public static async getValue(key: string)
	{
		const entry = await database.conn
			.selectFrom('config')
			.select([
				'value',
				'type',
			])
			.where('key', '=', key)
			.executeTakeFirst();

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

			case EntryDataTypes.DATE:
				return new Date(value as string);
		}

		return null;
	}

	public static async entryExists(key: string)
	{
		const entries = await database.conn
			.selectFrom('config')
			.where('key', '=', key)
			.execute();

		return entries.length > 0;
	}

	public static async deleteEntry(key: string)
	{
		await database.conn
			.deleteFrom('config')
			.where('key', '=', key)
			.execute();
	}

	public static async setValue(key: string, value: string | number | boolean | Date)
	{
		let type = EntryDataTypes.STRING;
		let toInsert: string = value as string;

		if (key.length === 0) {
			throw new Error(`The key has to be at least 1 character long.`);
		}

		switch (typeof value) {
			case 'object':
				if (value.getTime !== undefined) {
					type = EntryDataTypes.DATE;
					toInsert = value.toISOString();
				} else {
					throw new Error(`Value is an invalid type of Date object.`);
				}
				break;
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
			await database.conn
				.updateTable('config')
				.set({
					type,
					value: toInsert,
				})
				.where('key', '=', key)
				.execute();
		} else {
			await database.conn
				.insertInto('config')
				.values({
					key,
					type,
					value: toInsert,
				})
				.execute();
		}
	}
}

export default Config;
