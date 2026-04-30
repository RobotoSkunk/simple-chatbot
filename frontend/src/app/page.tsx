
'use client';

import {
	useContext,
} from 'react';

import {
	VaultsContext,
} from '@/contexts/vaults';

import Chat from '@/components/Chat';


export default function Home()
{
	const vaultsContext = useContext(VaultsContext);

	if (vaultsContext.data.length == 0) {
		return <></>;
	}

	return <Chat vaultId={ vaultsContext.data[vaultsContext.currentVault].id }/>;
}
