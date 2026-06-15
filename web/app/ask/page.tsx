import {
	useRef,
} from 'react';

import {
	Link,
} from 'react-router';

import {
	useImmer,
} from 'use-immer';

import Markdown from 'react-markdown';

import highlithting from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeMath from 'rehype-katex';
import remarkGfm from 'remark-gfm';

export default function PageAsk()
{
	const [ answer, setAnswer ] = useImmer('Ask anything!');
	const inputRef = useRef<HTMLInputElement | null>(null);

	async function buttonHandler()
	{
		if (!inputRef.current) {
			return;
		}

		setAnswer('');

		const response = await fetch('/api/ask', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ question: inputRef.current.value }),
		});

		const stream = response.body!.pipeThrough(new TextDecoderStream('utf-8')) as ReadableStream;

		for await (const value of stream) {
			const parts: string[] = (value as string).split('\0').filter(v => v.length > 0);

			for (const part of parts) {
				const chunk = JSON.parse(part) as { data: string };

				setAnswer(ans => ans + chunk.data);
			}
		}
	}

	return (<>
		<h1>Click the button to get an answer from the API</h1>
		<p>
			<input type='text' placeholder='Question' defaultValue='Hi there!' ref={ inputRef }/>
		</p>
		<p>
			<button onClick={ buttonHandler }>Get answer</button>
		</p>
		<p>
			<Markdown
				remarkPlugins={[
					remarkMath,
					remarkGfm,
				]}
				rehypePlugins={[
					rehypeMath,
					highlithting,
				]}
			>
				{ answer }
			</Markdown>
		</p>
		<Link to='/'>Go back</Link>
	</>);
}
