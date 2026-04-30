
import {
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

import {
	motion,
	Variants,
} from 'framer-motion';

import {
	ChatsContext,
} from '@/contexts/chats';

import {
	host,
} from '@/data/api';

import Link from 'next/link';
import Image from 'next/image';
import Dropdown from '../Dropdown';

import optionsIcon from '@/assets/icons/dots-vertical.svg';
import newChatIcon from '@/assets/icons/new-chat.svg';

import trashIcon from '@/assets/icons/trash.svg';
import penLineIcon from '@/assets/icons/pen-line.svg';

import checkIcon from '@/assets/icons/check.svg';

import style from './chatbutton.module.css';

export default function ChatButton({
	chatId,
	chatName,
	typeEffect,
}: {
	chatId?: string;
	chatName?: string;
	typeEffect?: boolean;
})
{
	const chatsContext = useContext(ChatsContext);
	
	const [ editing, setEditing ] = useState(false);
	const [ displayName, setDisplayName ] = useState('');
	const optionsToggleRef = useRef<HTMLButtonElement | null>(null);
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	const variants = {
		hide: {
			x: -150,
			opacity: 0,
		},
		show: {
			x: 0,
			opacity: 1,
		},
	} satisfies Variants;

	if (!chatId || !chatName) {
		return (
			<motion.div
				initial='show'
				animate='show'
				exit='hide'
				variants={ variants }

				className={ style.chatbutton + ' ' + style.template }
				key={ 'new-chat' }
				layout
			>
				<Link
					href='/'
				>
					<Image
						src={ newChatIcon }
						alt=''
						width={ 24 }
						height={ 24 }
					/>
					<span>New Chat</span>
				</Link>
			</motion.div>
		);
	}

	useEffect(() =>
	{
		let intervalId: NodeJS.Timeout | undefined = undefined;
		let currentIndex = 0;

		if (typeEffect) {
			intervalId = setInterval(() =>
			{
				if (currentIndex < chatName.length) {
					setDisplayName(chatName.slice(0, currentIndex + 1));
					currentIndex++;
				} else {
					clearInterval(intervalId);
				}
			}, 25);
		} else {
			setDisplayName(chatName);
		}

		return () => {
			clearInterval(intervalId);
		};
	}, [ chatName ]);

	return (
		<motion.div
			initial='hide'
			animate='show'
			exit='hide'
			variants={ variants }

			className={ style.chatbutton }
			key={ chatId }
			layout
		>
			{ !editing ?
				<>
					<Link href={ `/chat/${chatId}` }>
						{ displayName }
					</Link>
					<button
						ref={ optionsToggleRef }
						className={ style.options }
					>
						<div></div>
						<Image
							src={ optionsIcon }
							alt='Edit chat options'
							width={ 24 }
							height={ 24 }
						/>
					</button>
					<Dropdown
						toggleElement={ optionsToggleRef }
						position={{
							x: 'calc(100% + 5px)',
							y: 'calc(50% + 10px)',
						}}
						options={[
							{
								label: 'Edit name',
								icon: penLineIcon,
								onClick: async () => setEditing(true),
							},
							{
								label: 'Delete',
								icon: trashIcon,
								onClick: async () => {
									const confirmation = confirm(
										`Are you sure you want to delete this chat?\n\nThis can't be undone.`
									);

									if (confirmation) {
										try {
											await fetch(`${host}/vault/-/chat/${chatId}`, {
												method: 'DELETE',
											});

											const chats = [... chatsContext.data];
											const chatIndex = chats.findIndex(c => c.id === chatId);

											if (chatIndex >= 0) {
												chats.splice(chatIndex, 1);
											}

											chatsContext.update(chats);
										} catch (error) {
											console.error(error);
										}
									}
								},
							},
						]}
					/>
				</>
				:
				<>
					<textarea
						ref={ textAreaRef }
						defaultValue={ chatName }
					/>
					<button
						className={ style.options }
						onClick={async () => {
							if (textAreaRef.current) {
								const newName = textAreaRef.current.value;

								if (newName !== chatName) {
									const response = await fetch(`${host}/vault/-/chat/${chatId}`, {
										method: 'PATCH',
										headers: {
											'Content-Type': 'application/json',
										},
										body: JSON.stringify({
											name: newName,
										}),
									});

									const json = await response.json() as { success: boolean };

									if (json.success) {
										const chats = [... chatsContext.data];
										const chatData = chats.find(c => c.id === chatId);

										if (chatData) {
											chatData.name = newName;
										}

										chatsContext.update(chats);
									}
								}
							}

							setEditing(false);
						}}
					>
						<div></div>
						<Image
							src={ checkIcon }
							alt='Confirm editing'
							width={ 24 }
							height={ 24 }
						/>
					</button>
				</>
			}
		</motion.div>
	);
}
