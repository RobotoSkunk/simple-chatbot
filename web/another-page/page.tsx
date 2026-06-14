import { Link } from 'react-router';

export default function Page()
{
	return (<>
		<h1>You're now on another page!</h1>
		<Link to='/'>Go back</Link>
	</>);
}
