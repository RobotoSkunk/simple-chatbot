
'use client';

import {
	useEffect,
	useState,
} from 'react';

import {
	ChatsContext,
} from '@/contexts/chats';

import {
	VaultsContext,
} from '@/contexts/vaults';

import ChatButton from '../ChatButton';

import style from './dashboard.module.css';


export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>)
{
	const [ vaults, setVaults ] = useState<VaultData[]>([]);
	const [ chats, setChats ] = useState<ChatData[]>([]);

	useEffect(() =>
	{
		(async () =>
		{
			let vaultId = '';

			{
				const response = await fetch(`http://localhost:5080/vaults`);
				const list = await response.json() as VaultData[];

				vaultId = list[0].id;
				setVaults(list);
			}

			{
				const response = await fetch(`http://localhost:5080/vault/${vaultId}/chats`);
				const list = await response.json();

				setChats(list);
			}
		})();
	}, [ ]);

	function updateChats(data: ChatData[])
	{
		setChats([... data ]);
	}

	function updateVaults(data: VaultData[])
	{
		setVaults([... data ]);
	}

	return (
		<VaultsContext.Provider value={{ data: vaults, update: updateVaults }}>
			<ChatsContext.Provider value={{ data: chats, update: updateChats }}>
				<div className={ style.chats }>
					<ChatButton/>
					{ chats.toReversed().map((v, i) =>
					(
						<ChatButton
							chatId={ v.id }
							chatName={ v.name }
							key={ v.id }
						/>
					)) }
					<div>
						<button
							className={ style['vaults-button']}
						>
							<span>
								Vault
							</span>
						</button>
					</div>
				</div>
				<main>
					{ children }
				</main>
			</ChatsContext.Provider>
		</VaultsContext.Provider>
	);
}
