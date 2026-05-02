

declare global
{
	type ChunkStatusTypes = 'thinking' | 'web_search' | 'none';

	type ChunkStatusResponse = {
		type: 'status';
		status: ChunkStatusTypes;
	};

	type ChunkContentResponse = {
		type: 'writing';
		token: string;
	};

	type ChunkNewMessageDataResponse = {
		type: 'user_message_data';
		message_id: string;
	};

	type ChunkErrorResponse = {
		type: 'error';
	};

	type ChunkEndResponse = {
		type: 'end';
		message_id: string;
		elapsed_time: number;
	};

	type ChunkResponse =
		ChunkStatusResponse |
		ChunkContentResponse |
		ChunkNewMessageDataResponse |
		ChunkErrorResponse |
		ChunkEndResponse;

}

export { };
