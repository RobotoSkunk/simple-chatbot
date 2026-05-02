
import type {
	Metadata,
} from 'next';

import {
	Noto_Sans,
} from 'next/font/google';

import '../../(main)/globals.css';

const notoSansFont = Noto_Sans();

export const metadata: Metadata = {
	title: 'First Setup',
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
					{ children }
				</div>
			</body>
		</html>
	);
}
