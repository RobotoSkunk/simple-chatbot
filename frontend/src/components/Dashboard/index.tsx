
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

import {
	smooth,
} from '@/data/transitions';

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
	const [ models, setModels ] = useState<ModelData[]>([]);

	const [ vaultSettingsOpen, setVaultSettingsOpen ] = useState(false);
	const [ settingsSection, setSettingsSection ] = useState(0);

	useEffect(() =>
	{
		(async () =>
		{
			const response = await fetch(`${host}/vaults`);
			const list = await response.json() as VaultData[];

			setVaults(list);

			const responseModels = await fetch(`${host}/ollama/models`);
			const modelsList = await responseModels.json() as ModelData[];

			setModels(modelsList);
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

	function changeCurrentVault(id: string)
	{
		let vaultIndex = vaults.findIndex(v => v.id === id);

		if (vaultIndex < 0) {
			vaultIndex = 0;
		}

		setCurrentVault(vaultIndex);
		localStorage.setItem('current_vault', id);
	}

	function openSettingsModal()
	{
		setVaultSettingsOpen(true);
		setSettingsSection(0);
	}

	return (
		<VaultsContext.Provider
			value={{
				currentVault,
				data: vaults,
				update: updateVaults,
				setCurrentVault: changeCurrentVault,
			}}
		>
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
									transition={ smooth }
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
								onClick={ () => openSettingsModal() }
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
													let vaultIndex = vaults.findIndex(vi => vi.id === v.id);

													if (vaultIndex !== currentVault) {
														localStorage.setItem('current_vault', v.id);
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
						title='Vault Settings'
						open={ vaultSettingsOpen }
						onCloseRequest={ () => setVaultSettingsOpen(false) }

						style={{
							minHeight: 420,
							maxHeight: 620,
						}}
					>
						<div className={ style['vault-settings'] }>
							<div className={ style.sections }>
								<button
									className='default'
									onClick={ () => setSettingsSection(0) }
								>
									General
								</button>
								<button
									className='default'
									onClick={ () => setSettingsSection(1) }
								>
									Directories
								</button>
								<button
									className='default'
									onClick={ () => setSettingsSection(2) }
								>
									Delete
								</button>
							</div>
							<div className={ style.content }>
								{ settingsSection === 0 &&
									<form
										onSubmit={ async (ev) => {
											ev.preventDefault();
											const form = new FormData(ev.currentTarget);

											if (!ev.currentTarget.checkValidity()) {
												ev.currentTarget.reportValidity();
											}

											const response = await fetch(`${host}/vault/${vaults[currentVault].id}`, {
												method: 'PATCH',
												headers: {
													'Content-Type': 'application/json',
												},
												body: JSON.stringify({
													name: form.get('name'),
													user_prompt: form.get('user-prompt'),
													ai_model: form.get('ai-model'),
												}),
											});

											const json = await response.json() as { success: boolean };

											if (json.success) {
												setVaults(v => {
													const vault = v.find(vi => vi.id === vaults[currentVault].id);

													if (!vault) {
														return;
													}

													vault.name = form.get('name') as string;
													vault.user_prompt = form.get('user-prompt') as string;
													vault.ai_model = form.get('user-prompt') as string;
												});

												setVaultSettingsOpen(false);
											}
										} }
									>
										<p className={ style['user-input'] }>
											<label htmlFor='name'>Vault's name</label><br/>
											<input
												type='text'
												name='name'
												id='name'
												defaultValue={ vaults[currentVault].name }
												required
											/>
										</p>
										<p className={ style['user-input'] }>
											<label htmlFor='user-prompt'>Custom prompt</label><br/>
											<textarea
												name='user-prompt'
												id='user-prompt'
												defaultValue={ vaults[currentVault].user_prompt }
												rows={ 5 }
											/>
										</p>
										<p className={ style['user-input'] }>
											<label htmlFor='user-prompt'>AI Model</label><br/>
											<select
												name='ai-model'
												defaultValue={ vaults[currentVault].ai_model }
											>
												{ models.map((model, i) => (
													<option
														key={ i }
														value={ model.id }
													>
														{ model.name }
													</option>
												)) }
											</select>
										</p>
										<p className={ style.actions }>
											<button>Save</button>
											<button
												onClick={ (ev) => {
													ev.preventDefault();
													setVaultSettingsOpen(false);
												} }
											>
												Cancel
											</button>
										</p>
									</form>
								}
								{ settingsSection === 2 &&
									<div>
										<p>
											Are you sure you want to delete the vault?
											It'll delete all your chats in the vault, this isn't reversible.
										</p>
										<button>I'm sure, delete</button>
									</div>
								}
							</div>
						</div>
					</Modal>
				}
			</ChatsContext.Provider>
		</VaultsContext.Provider>
	);
}
