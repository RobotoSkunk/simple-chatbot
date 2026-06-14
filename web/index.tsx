
import {
	StrictMode,
} from 'react';

import {
	createRoot,
} from 'react-dom/client';

import {
	BrowserRouter,
	Route,
	Routes,
} from 'react-router';

import Page from './page';
import AnotherPage from './another-page/page';


import.meta.hot.data.root ??= createRoot(document.body).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path='/' element={ <Page/> }/>
				<Route path='/another-page' element={ <AnotherPage/> }/>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
