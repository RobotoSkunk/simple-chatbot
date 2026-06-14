
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import.meta.hot.data.root ??= createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App/>
	</StrictMode>
);
