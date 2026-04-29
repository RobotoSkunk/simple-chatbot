
'use client';

import {
	use,
	useContext,
} from 'react';

import {
	VaultsContext,
} from '@/contexts/vaults';

import Chat from '@/components/Chat';


export default function Page({
	params,
}: {
	params: Promise<{ chat_id: string }>,
})
{
	const chatId = use(params).chat_id;
	const vaultsContext = useContext(VaultsContext);

	if (vaultsContext.data.length == 0) {
		return <></>;
	}

	return <Chat chatId={ chatId } vaultId={ vaultsContext.data[0].id }/>;
}
