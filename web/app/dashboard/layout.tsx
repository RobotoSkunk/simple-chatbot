import {
	Outlet,
	useNavigate,
} from 'react-router';

import {
	useEffect,
} from 'react';

import '../globals.css';

export default function Layout()
{
	const navigate = useNavigate();

	useEffect(() =>
	{
		async function fetchIdentity()
		{
			const response = await fetch('/api/auth/identity');
			const identity = await response.json() as { dek: string | null };

			if (!identity.dek) {
				await navigate('/setup');
			}
		}

		fetchIdentity();
	}, [ ]);

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
