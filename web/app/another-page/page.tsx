import {
	Link,
} from 'react-router';

export default function PageAnotherPage()
{
	return (<>
		<h1>You're now on another page!</h1>
		<Link to='/'>Go back</Link>
	</>);
}
