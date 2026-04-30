
'use client';

import { 
	createContext,
} from 'react';

export const VaultsContext = createContext<{
	currentVault: number;
	data: VaultData[];
	update: (data: VaultData[]) => void;
}>({
	currentVault: 0,
	data: [],
	update: () => {},
});
