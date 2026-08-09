import {
	secrets,
} from 'bun';


export class Secrets
{
	private static service = 'com.robotoskunk.simplechatbot';

	public static async set(name: string, value: string)
	{
		await secrets.set({
			service: this.service,
			name,
			value,
		});
	}

	public static async get(name: string)
	{
		return await secrets.get({
			service: this.service,
			name,
		});
	}

	public static async delete(name: string)
	{
		return await secrets.delete({
			service: this.service,
			name,
		});
	}
}
