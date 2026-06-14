import { Link } from 'react-router';

export default function Page()
{
	return (<>
		<h1>Does this work?</h1>
		<p>*toc toc* is anyone there?</p>
		<Link to='/another-page'>Go to another page</Link>
	</>);
}
