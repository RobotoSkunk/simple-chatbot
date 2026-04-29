
declare global
{
	interface VaultData
	{
		id: string;
		name: string;
		emote: string;
		created_at: number;
	}

	interface ChatData
	{
		id: string;
		name: string;
		color: number;
		is_deleted: boolean;
		created_at: number;
	}

	interface MessageData
	{
		id: string;
		role: 'user' | 'assistant';
		index: number;
		content: string;
		generation_time: number;
		created_at: number;
	}

	interface Window
	{
		chatbotMessage?: string;
	}
}

export { };
