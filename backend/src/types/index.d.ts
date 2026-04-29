
import type Database from '../database/connection';

import {
	type Response,
} from 'express';

import {
	type Ollama
} from 'ollama';


declare global
{
	type MessageRoles = 'user' | 'assistant';
	// type ToolTypes = 'system' | 'user' | 'assistant' | 'tool';

	namespace Express
	{
		interface Response
		{
			database: Database;
			ollama: Ollama;
		}
	}

	interface WebSearchResult {
		content: string;
		url: string;
		title: string;
	}
}

export = Response;
