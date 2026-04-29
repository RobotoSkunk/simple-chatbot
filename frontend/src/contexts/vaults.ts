
'use client';

import { createContext } from 'react';

export const VaultsContext = createContext<{
	data: VaultData[];
	update: (data: VaultData[]) => void;
}>({
	data: [],
	update: () => {},
});
