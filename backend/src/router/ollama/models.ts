
import {
	type Request,
	type Response,
} from 'express';

import { ollama } from '../../client/ollama';

export default async function(req: Request, res: Response)
{
	const { models } = await ollama.list();

	res.json(
		models.map((model) =>
		({
			id: model.model,
			name: model.name,
		}))
	);
}
