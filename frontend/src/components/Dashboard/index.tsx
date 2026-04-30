
'use client';

import {
	useEffect,
	useState,
} from 'react';

import {
	useRouter,
} from 'next/navigation';

import Image from 'next/image';

import {
	Noto_Emoji,
} from 'next/font/google';

import {
	AnimatePresence,
	motion,
	stagger,
} from 'framer-motion';

import {
	useImmer,
} from 'use-immer';

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
import Modal from '../Modal';

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
	const router = useRouter();

	const [ vaults, setVaults ] = useImmer<VaultData[]>([]);
	const [ vaultsOpen, setVaultsOpen ] = useState(false);
	const [ currentVault, setCurrentVault ] = useState(0);

	const [ chats, setChats ] = useState<ChatData[]>([]);

	const [ modalEditVaultOpen, setModalEditVaultOpen ] = useState(false);

	useEffect(() =>
	{
		(async () =>
		{
			const response = await fetch(`${host}/vaults`);
			const list = await response.json() as VaultData[];

			setVaults(list);
		})();
	}, [ ]);

	useEffect(() =>
	{
		if (!vaults[currentVault]) {
			return;
		}

		(async () =>
		{
			let vaultId = vaults[currentVault].id;

			const response = await fetch(`${host}/vault/${vaultId}/chats`);
			const list = await response.json();

			setChats(list);

			const storedVault = localStorage.getItem('current_vault') ?? '';
			let vaultIndex = vaults.findIndex(v => v.id === storedVault);

			if (vaultIndex < 0) {
				vaultIndex = 0;
			}

			setCurrentVault(vaultIndex);
		})();
	}, [ vaults, currentVault ]);

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
				<motion.div
					className={ style.chats }
					variants={{
						hide: {
							transition: {
								delayChildren: stagger(0.1),
							}
						},
						show: {
							transition: {
								delayChildren: stagger(0.1),
							}
						},
					}}
				>
					<div className={ style['vault']}>
						<button
							className={ style['dropdown-toggle'] + ' default' }
							onClick={() =>
							{
								setVaultsOpen(!vaultsOpen);
							}}
						>
							<AnimatePresence mode='wait'>
								<motion.div
									className={ style['display-name'] }
									key={ vaults[currentVault]?.id }

									initial={{ y: -35, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: 35, opacity: 0 }}
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
									<span className={ style.name }>
										{ vaults[currentVault]?.name }
									</span>
								</motion.div>
							</AnimatePresence>
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
								className={ style['vault-options'] + ' default' }
								onClick={ () => setModalEditVaultOpen(true) }
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
						<AnimatePresence>
							{ vaultsOpen &&
								<motion.div
									className={ style.vaults }

									initial={{ height: 0 }}
									animate={{ height: 'auto' }}
									exit={{ height: 0 }}
								>
									{ vaults.map((v) => (
										<div
											className={ style.vault }
											key={ v.id }
										>
											<button
												className={ style['dropdown-toggle'] + ' default' }
												onClick={() =>
												{
													localStorage.setItem('current_vault', v.id);
													let vaultIndex = vaults.findIndex(vi => vi.id === v.id);

													if (vaultIndex !== currentVault) {
														setCurrentVault(vaultIndex);
														router.push('/');
													}

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
												<span className={ style.name }>
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
											className={ style['dropdown-toggle'] + ' default' }
											onClick={ async () => {
												const newVaultName = prompt('Enter the name for your new vault.', 'New Vault');

												if (!newVaultName) {
													setVaultsOpen(false);
													return;
												}

												const response = await fetch(`${host}/vault`, {
													method: 'POST',
													headers: {
														'Content-Type': 'application/json',
													},
													body: JSON.stringify({
														name: newVaultName,
													}),
												});

												const json = await response.json() as VaultData;

												setVaults([
													...vaults,
													json,
												]);
												localStorage.setItem('current_vault', json.id);

												router.push('/');
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
							}
						</AnimatePresence>
					</div>
					<AnimatePresence mode='popLayout'>
						{ chats.map((v) =>
						(
							<ChatButton
								chatId={ v.id }
								chatName={ v.name }
								typeEffect={ v.ai_generated }
								key={ v.id }
							/>
						)) }
						<ChatButton/>
					</AnimatePresence>
				</motion.div>
				<main>
					{ children }
				</main>
				{ vaults[currentVault] &&
					<Modal
						open={ modalEditVaultOpen }
						onCloseRequest={ () => setModalEditVaultOpen(false) }
					>
						<form
							onSubmit={ async (ev) => {
								ev.preventDefault();
								const form = new FormData(ev.currentTarget);

								const response = await fetch(`${host}/vault/${vaults[currentVault].id}`, {
									method: 'PATCH',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										name: form.get('name'),
										user_prompt: form.get('user-prompt'),
									}),
								});

								const json = await response.json() as { success: boolean };

								if (json.success) {
									setVaults(v => {
										const vault = v[currentVault];

										vault.name = form.get('name') as string;
										vault.user_prompt = form.get('user-prompt') as string;
									});

									setModalEditVaultOpen(false);
								}
							} }
						>
							<input
								type='text'
								name='name'
								defaultValue={ vaults[currentVault].name }
							/>
							<textarea
								name='user-prompt'
								defaultValue={ vaults[currentVault].user_prompt }
							/>
							<p>
								<button>
									Save
								</button>
								<button
									onClick={ (ev) => {
										ev.preventDefault();
										setModalEditVaultOpen(false);
									} }
								>
									Cancel
								</button>
							</p>
						</form>
					</Modal>
				}
			</ChatsContext.Provider>
		</VaultsContext.Provider>
	);
}
