
'use client';

import {
	use,
	useContext,
	useEffect,
} from 'react';

import {
	useRouter,
} from 'next/navigation';

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

			const currentVaultId = localStorage.getItem('current_vault');

			if (currentVaultId !== data.vault_id) {
				vaultsContext.setCurrentVault(data.vault_id);
			}
		})();
	}, [ vaultsContext.data ]);

	if (vaultsContext.data.length == 0) {
		return <></>;
	}

	return <Chat chatId={ chatId } vaultId={ vaultsContext.data[0].id }/>;
}
