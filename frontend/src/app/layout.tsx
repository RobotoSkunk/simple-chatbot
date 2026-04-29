
import type {
	Metadata,
} from 'next';

import Dashboard from '@/components/Dashboard';

import './globals.css';


export const metadata: Metadata = {
	title: 'Personal Chatbot',
};


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>)
{
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
				<div id='app'>
					<Dashboard>
						{ children }
					</Dashboard>
				</div>
			</body>
		</html>
	);
}
