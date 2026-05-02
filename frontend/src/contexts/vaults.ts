
'use client';

import { 
	createContext,
} from 'react';

export const VaultsContext = createContext<{
	currentVault: number;
	data: VaultData[];
	update: (data: VaultData[]) => void;
	setCurrentVault: (id: string) => void;
}>({
	currentVault: 0,
	data: [],
	update: () => {},
	setCurrentVault: () => {},
});
