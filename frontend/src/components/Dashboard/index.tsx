
'use client';

import {
	useEffect,
	useState,
} from 'react';

import Image from 'next/image';

import {
	Noto_Emoji,
} from 'next/font/google';

import {
	AnimatePresence,
	LayoutGroup,
	motion,
} from 'framer-motion';

import {
	ChatsContext,
} from '@/contexts/chats';

import {
	VaultsContext,
} from '@/contexts/vaults';

import {
	host,
} from '@/data/api';

import ChatButton from '../ChatButton';

import style from './dashboard.module.css';

import optionsIcon from '@/assets/icons/dots-vertical.svg';
import chevronIcon from '@/assets/icons/chevron-down.svg';
import vaultIcon from '@/assets/icons/vault.svg';
import plusIcon from '@/assets/icons/plus.svg';

const notoEmojiFont = Noto_Emoji({
	weight: '700',
});

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
				const response = await fetch(`${host}/vaults`);
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
				const response = await fetch(`${host}/vault/${vaultId}/chats`);
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
					<AnimatePresence mode='popLayout'>
						<ChatButton/>
						{ chats.toReversed().map((v) =>
						(
							<ChatButton
								chatId={ v.id }
								chatName={ v.name }
								typeEffect={ v.ai_generated }
								key={ v.id }
							/>
						)) }
					</AnimatePresence>
					<div className={ style['vault']}>
						<button
							className={ style['dropdown-toggle'] }
							onClick={() =>
							{
								setVaultsOpen(!vaultsOpen);
							}}
						>
							{ vaults[currentVault]?.emote ?
								<div
									className={ style['vault-icon'] + ' ' + notoEmojiFont.className }
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
							<span>
								{ vaults[currentVault]?.name }
							</span>
							<div className={ style.space }></div>
							<motion.div
								className={ style.arrow }
								animate={{
									rotate: vaultsOpen ? '180deg' : '0deg',
								}}
							>
								<Image
									src={ chevronIcon }
									alt=''
									width={ 20 }
									height={ 20 }
								/>
							</motion.div>
						</button>
						<div>
							<button
								className={ style['vault-options'] }
							>
								<div></div>
								<Image
									src={ optionsIcon }
									alt=''
									width={ 20 }
									height={ 20 }
									className={ style.arrow }
								/>
							</button>
						</div>
						<motion.div
							className={ style.vaults }
							animate={{
								height: vaultsOpen ? 'auto' : 0,
							}}
						>
							{ vaults.map((v) => (
								<div
									className={ style.vault }
									key={ v.id }
								>
									<button
										className={ style['dropdown-toggle'] }
										onClick={() =>
										{
											setVaultsOpen(false);
										}}
									>
										{ v.emote ?
											<div
												className={ style['vault-icon'] + ' ' + notoEmojiFont.className }
											>
												{ v.emote }
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
										<span>
											{ v.name }
										</span>
										<div className={ style.space }></div>
									</button>
								</div>
							)) }
							<div
								className={ style.vault + ' ' + style.new }
							>
								<button
									className={ style['dropdown-toggle'] }
									onClick={() => {
										setVaultsOpen(false);
									}}
								>
									<Image
										src={ plusIcon }
										alt=''
										width={ 25 }
										height={ 25 }
									/>
									<span>
										New Vault
									</span>
								</button>
							</div>
						</motion.div>
					</div>
				</div>
				<main>
					{ children }
				</main>
			</ChatsContext.Provider>
		</VaultsContext.Provider>
	);
}
