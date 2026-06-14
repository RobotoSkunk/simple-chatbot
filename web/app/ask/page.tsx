import {
	useState,
} from 'react';

import {
	Link,
} from 'react-router';

export default function PageAsk()
{
	const [ answer, setAnswer ] = useState('');

	async function buttonHandler()
	{
		const response = await fetch('/api/time');
		const json = await response.json() as { timestamp: number, time: string };

		setAnswer(`${json.time} (${json.timestamp})`);
	}

	return (<>
		<h1>Click the button to get an answer from the API</h1>
		<button onClick={ buttonHandler }>Get answer</button>
		<p>Answer: { answer }</p>
		<Link to='/'>Go back</Link>
	</>);
}
