import {
	Outlet,
} from 'react-router';

import './globals.css';

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
