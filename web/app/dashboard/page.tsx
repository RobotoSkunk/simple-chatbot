import {
	Link,
} from 'react-router';

export default function PageHome()
{
	return (<>
		<h1>Does this work?</h1>
		<h2>Does this work?</h2>
		<h3>Does this work?</h3>
		<h4>Does this work?</h4>
		<h5>Does this work?</h5>
		<h6>Does this work?</h6>
		<p>*toc toc* is anyone there?</p>
		<p>
			<Link to='/another-page'>Go to another page</Link>
		</p>
		<p>
			<Link to='/ask'>Go to ask page</Link>
		</p>
		<p>
			<Link to='/gsdfgsfdsgdfgsdf'>New page</Link>
		</p>
		<p>
			<button>Button</button>
			<button className='success'>Success</button>
			<button className='danger'>Error</button>

			<button disabled>Button</button>
			<button className='success' disabled>Success</button>
			<button className='danger' disabled>Error</button>
		</p>
		<p>
			<input/>
		</p>
		<p>
			<select>
				<option>Option</option>
				<option>Option</option>
				<option>Option</option>
				<option>Option</option>
			</select>
		</p>
	</>);
}
