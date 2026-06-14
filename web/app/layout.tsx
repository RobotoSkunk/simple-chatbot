import {
	Outlet,
} from 'react-router';

export default function Layout()
{
	return (
		<>
			<header>Header</header>
			<div>
				<Outlet/>
			</div>
			<footer>Footer</footer>
		</>
	);
}
