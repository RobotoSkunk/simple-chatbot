
'use client';

import {
	useEffect,
	useState,
} from 'react';

import Image from 'next/image';

import {
	ChatsContext,
} from '@/contexts/chats';

import {
	VaultsContext,
} from '@/contexts/vaults';

import ChatButton from '../ChatButton';

import arrowIcon from '@/assets/icons/arrow-down.svg';
import vaultIcon from '@/assets/icons/vault.svg';
import style from './dashboard.module.css';


export default function Dashboard({
	children,
}: Readonly<{
	children: React.ReactNode;
}>)
{
	const [ vaults, setVaults ] = useState<VaultData[]>([]);
	const [ vaultsOpen, setVaultsOpen ] = useState(false);
	const [ currentVault, setCurrentVault ] = useState(0);

	const [ chats, setChats ] = useState<ChatData[]>([]);

	useEffect(() =>
	{
		(async () =>
		{
			let vaultId = '';

			{
				const response = await fetch(`http://localhost:5080/vaults`);
				const list = await response.json() as VaultData[];

				setVaults(list);

				const storedVault = localStorage.getItem('current_vault') ?? '';
				let vaultIndex = list.findIndex(v => v.id === storedVault);

				if (vaultIndex < 0) {
					vaultIndex = 0;
				}

				vaultId = list[vaultIndex].id;
				setCurrentVault(vaultIndex);
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
		<VaultsContext.Provider value={{ currentVault, data: vaults, update: updateVaults }}>
			<ChatsContext.Provider value={{ data: chats, update: updateChats }}>
				<div className={ style.chats }>
					<ChatButton/>
					{ chats.toReversed().map((v) =>
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
							onClick={() =>
							{
								setVaultsOpen(!vaultsOpen);
							}}
						>
							<span>
								{ vaults[currentVault]?.emote ?
									<div
										className={ style['vault-icon'] }
									>
										{ vaults[currentVault].emote }
									</div>
									:
									<Image
										src={ vaultIcon }
										alt=''
										width={ 20 }
										height={ 20 }
										className={ style['vault-icon'] }
									/>
								}
								{ vaults[currentVault]?.name }
							</span>
							<Image
								src={ arrowIcon }
								alt=''
								width={ 20 }
								height={ 20 }
								className={ style.arrow }
							/>
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
