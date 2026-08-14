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
			const response = await fetch('/api/identity');
			const identity = await response.json() as { encryptionKey: string | null };

			if (!identity.encryptionKey) {
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
