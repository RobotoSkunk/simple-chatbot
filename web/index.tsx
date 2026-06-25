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

import Layout from '@app/layout';

import PageHome from '@app/page';
import PageAnotherPage from '@app/another-page/page';
import PageAsk from '@app/ask/page';

(import.meta.hot.data.root ??= createRoot(document.body)).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={ <Layout/> }>
					<Route path='/' element={ <PageHome/> }/>
					<Route path='/another-page' element={ <PageAnotherPage/> }/>
					<Route path='/ask' element={ <PageAsk/> }/>
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
