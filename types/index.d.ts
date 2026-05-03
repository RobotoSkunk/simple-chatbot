

declare global
{
	type ChunkStatusTypes = 'thinking' | 'web_search' | 'typing' | 'none';

	type ChunkStatusResponse = {
		type: 'status';
		status: ChunkStatusTypes;
	};

	type ChunkContentResponse = {
		type: 'writing';
		token: string;
	};

	type ChunkNewMessageDataResponse = {
		type: 'message_data';
		role: 'user' | 'assistant';
		message_id: string;
		elapsed_time: number;
	};

	type ChunkErrorResponse = {
		type: 'error';
		message: string;
	};

	type ChunkEndResponse = {
		type: 'end';
	};

	type ChunkResponse =
		ChunkStatusResponse |
		ChunkContentResponse |
		ChunkNewMessageDataResponse |
		ChunkErrorResponse |
		ChunkEndResponse;

}

export { };
