import {
	createRoot,
} from 'react-dom/client';

import {
	BrowserRouter,
	Route,
	Routes,
} from 'react-router';

import Layout from '@app/dashboard/layout';

import PageHome from '@app/dashboard/page';
import PageAnotherPage from '@app/dashboard/another-page/page';
import PageAsk from '@app/dashboard/ask/page';
import Setup from '@app/setup/page';

(import.meta.hot.data.root ??= createRoot(document.body)).render(
	<BrowserRouter>
		<Routes>
			<Route path='setup' element={ <Setup/> }/>

			<Route element={ <Layout/> }>
				<Route index element={ <PageHome/> }/>
				<Route path='another-page' element={ <PageAnotherPage/> }/>
				<Route path='ask' element={ <PageAsk/> }/>
			</Route>
		</Routes>
	</BrowserRouter>
);
