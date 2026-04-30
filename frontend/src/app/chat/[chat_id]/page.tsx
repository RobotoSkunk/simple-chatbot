
'use client';

import {
	use,
	useContext,
	useEffect,
} from 'react';

import {
	VaultsContext,
} from '@/contexts/vaults';

import Chat from '@/components/Chat';
import { useRouter } from 'next/navigation';


export default function Page({
	params,
}: {
	params: Promise<{ chat_id: string }>,
})
{
	const chatId = use(params).chat_id;
	const vaultsContext = useContext(VaultsContext);
	const router = useRouter();

	useEffect(() =>
	{
		(async () =>
		{
			const response = await fetch(`http://localhost:5080/vault/-/chat/${chatId}`);
			const data = await response.json() as { vault_id: string, error?: string };

			if (data.error) {
				router.push('/');
				return;
			}

			let vaultIndex = vaultsContext.data.findIndex(v => v.id === data.vault_id);

			if (vaultIndex !== vaultsContext.currentVault) {
				router.push('/');
			}
		})();
	}, [ vaultsContext.data ]);

	if (vaultsContext.data.length == 0) {
		return <></>;
	}

	return <Chat chatId={ chatId } vaultId={ vaultsContext.data[0].id }/>;
}
