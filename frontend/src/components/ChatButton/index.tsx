
import {
	useContext,
	useRef,
	useState,
} from 'react';

import {
	ChatsContext,
} from '@/contexts/chats';

import Link from 'next/link';
import Image from 'next/image';
import Dropdown from '../Dropdown';

import editIcon from '@/assets/icons/edit.svg';
import newChatIcon from '@/assets/icons/new-chat.svg';

import trashIcon from '@/assets/icons/trash.svg';
import penLineIcon from '@/assets/icons/pen-line.svg';

import checkIcon from '@/assets/icons/check.svg';
// import crossIcon from '@/assets/icons/cross.svg';

import style from './chatbutton.module.css';

export default function ChatButton({
	chatId,
	chatName,
}: {
	chatId?: string;
	chatName?: string;
})
{
	const chatsContext = useContext(ChatsContext);
	
	const [ editing, setEditing ] = useState(false);
	const optionsToggleRef = useRef<HTMLButtonElement | null>(null);
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	if (!chatId || !chatName) {
		return (
			<Link
				href='/'
				className={ style.chatbutton + ' ' + style.template }
			>
				<Image
					src={ newChatIcon }
					alt=''
					width={ 24 }
					height={ 24 }
				/>
				<span>New Chat</span>
			</Link>
		);
	}

	return (
		<div className={ style.chatbutton }>
			{ !editing ?
				<>
					<Link href={ `/chat/${chatId}` }>
						{ chatName }
					</Link>
					<button
						ref={ optionsToggleRef }
						className={ style.options }
					>
						<div></div>
						<Image
							src={ editIcon }
							alt='Edit chat options'
							width={ 24 }
							height={ 24 }
						/>
					</button>
					<Dropdown
						toggleElement={ optionsToggleRef }
						position={{
							x: 'calc(100% - 15px)',
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
											await fetch(`http://localhost:5080/vault/-/chat/${chatId}`, {
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
									const response = await fetch(`http://localhost:5080/vault/-/chat/${chatId}`, {
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
		</div>
	);
}
