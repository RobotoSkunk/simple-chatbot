import {
	Link,
} from 'react-router';

export default function PageHome()
{
	return (<>
		<h1>Does this work?</h1>
		<p>*toc toc* is anyone there?</p>
		<p>
			<Link to='/another-page'>Go to another page</Link>
		</p>
		<p>
			<Link to='/ask'>Go to ask page</Link>
		</p>
	</>);
}
