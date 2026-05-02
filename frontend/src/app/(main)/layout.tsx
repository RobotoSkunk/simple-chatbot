
import type {
	Metadata,
} from 'next';

import {
	Noto_Sans,
} from 'next/font/google';

import Dashboard from '@/components/Dashboard';

import './globals.css';

const notoSansFont = Noto_Sans();

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
			<body className={ notoSansFont.className }>
				<div id='app'>
					<Dashboard>
						{ children }
					</Dashboard>
				</div>
			</body>
		</html>
	);
}
