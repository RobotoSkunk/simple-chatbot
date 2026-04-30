
'use client';

import {
	useRef,
	useEffect,
	useContext,
	useState,
} from 'react';

import {
	useImmer,
} from 'use-immer';

import {
	useRouter,
} from 'next/navigation';

import {
	ChatsContext,
} from '@/contexts/chats';

// import {
// 	VaultsContext,
// } from '@/contexts/vaults';

import {
	type ReadableStream,
} from 'stream/web';

import Image from 'next/image';

import Message from '@/components/Message';
import DottedDiv from '@/components/DottedDiv';

import style from './chat.module.css';

import sendIcon from '@/assets/icons/send.svg';
import spinnerIcon from '@/assets/icons/spinner.svg';


// const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const host = 'http://localhost:5080';

export default function Chat({
	vaultId,
	chatId,
}: {
	vaultId: string;
	chatId?: string;
})
{
	const router = useRouter();

	const chatsContext = useContext(ChatsContext);
	// const vaultsContext = useContext(VaultsContext);
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

	const [ messages, setMessages ] = useImmer<MessageData[]>([]);
	const [ busy, setBusy ] = useState(false);
	const [ status, setStatus ] = useState<ChunkStatusTypes>('thinking');

	let alreadyCalled = false;


	useEffect(() =>
	{
		if (window.chatbotMessage) {
			const message = window.chatbotMessage;
			window.chatbotMessage = undefined;
			alreadyCalled = true;

			(async () =>
			{
				setBusy(true);

				try {
					await sendMessage(message);
				} catch (error) {
					console.error(error);
				} finally {
					setBusy(false);
				}
			})();
		} else if (chatId && !alreadyCalled) {
			(async () =>
			{
				const response = await fetch(`${host}/vault/${vaultId}/chat/${chatId}/messages`);
				const json: MessageData[] = await response.json();
				console.log(json);

				setMessages(json);
			})();
		}
	}, [ ]);

	useEffect(() =>
	{
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTo({
				top: messagesContainerRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [ messages ]);

	async function sendMessage(content: string)
	{
		const message: MessageData = {
			id: ':new_assistant',
			role: 'assistant',
			content: '',
			created_at: Date.now(),
			generation_time: 0,
			index: 0,
		};

		if (content) {
			setMessages([
				...messages,
				{
					id: ':new_user',
					role: 'user',
					content: content,
					created_at: Date.now(),
					generation_time: 0,
					index: 0,
				},
				message,
			]);
		}

		const response = await fetch(`${host}/vault/${vaultId}/chat/${chatId}/message`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ content }),
		});

		if (response.body) {
			const stream = response.body.pipeThrough(new TextDecoderStream('utf-8')) as ReadableStream;

			for await (const value of stream) {
				const parts: string[] = value.split('\n');

				for (const part of parts) {
					if (!part || part === ':heartbeat') {
						continue;
					}

					let data: ChunkResponse;

					try {
						data = JSON.parse(part);
					} catch (error) {
						console.warn('Illegal JSON', error);
						console.log(part);
						continue;
					}

					console.log(data);

					switch (data.type) {
						case 'writing': {
							setMessages(m => {
								const msg = m.find(m => m.id === ':new_assistant');

								if (msg) {
									msg.content += data.token;
								}
							});

							break;
						}

						case 'end': {
							if (data.message_id === 'no-response') {
								const messagesCopy = [... messages];
								messagesCopy.pop();

								setMessages(messagesCopy);
							} else {
								setMessages(m => {
									const msg = m.find(m => m.id === ':new_assistant');

									if (msg) {
										msg.id = data.message_id;
										msg.created_at = Date.now();
										msg.generation_time = data.elapsed_time;
									}
								});
							}
							break;
						}

						case 'user_message_data': {
							if (!content) {
								break;
							}

							setMessages(m => {
								const msg = m.find(m => m.id === ':new_user');

								if (msg) {
									msg.id = data.message_id;
								}
							});

							break;
						}

						case 'status': {
							if (!content) {
								break;
							}

							setStatus(data.status);
							break;
						}
					}
				}
			}
		}
	}

	async function onSendClick(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>)
	{
		ev.preventDefault();

		if (!textAreaRef.current) {
			return;
		}

		setBusy(true);

		const content = textAreaRef.current.value;

		if (!chatId) {
			window.chatbotMessage = content;

			try {
				const response = await fetch(`${host}/vault/${vaultId}/chat`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						content,
					}),
				});

				const newSessionData: ChatData = await response.json();
				chatsContext.update([
					...chatsContext.data,
					{
						...newSessionData,
						ai_generated: true,
					},
				]);

				router.push(`/chat/${newSessionData.id}`);
			} catch (error) {
				console.error(error);
				setBusy(false);
			}

			return;
		}

		textAreaRef.current.value = '';
		textAreaRef.current.style.height = 'auto';

		try {
			await sendMessage(content);
		} catch (error) {
			console.error(error);
		} finally {
			setBusy(false);
		}
	}

	function resize()
	{
		if (!textAreaRef.current) {
			return;
		}

		textAreaRef.current.style.height = 'auto';

		if (textAreaRef.current.value.indexOf('\n') >= 0) {
			let height = textAreaRef.current.scrollHeight;

			if (height > 350) {
				height = 350
			}

			textAreaRef.current.style.height = height + 'px';
		}
	}


	return (
		<div className={ [
			style.container,
			!chatId ? style.welcome : '',
		].join(' ') }>
			{ chatId && <>
				<div
					className={ style.messages }
					ref={ messagesContainerRef }
				>
					<div className={ style.wrapper }>
						{ messages && messages.map((v) =>
						(
							<Message
								key={ v.id }
								createdAt={ new Date(v.created_at) }
								role={ v.role }
							>
								{ v.role === 'assistant' && ( v.content ||
									<div className={ style.loader }>
										<div className={ style.dot }></div>
										<div className={ style.dot }></div>
										<div className={ style.dot }></div>
									</div>
								) }
								{ v.role === 'user' && ( v.content ||
									<span className={ style.empty }>[ Empty message... ]</span>
								) }
							</Message>
						)) }
					</div>
				</div>
				<DottedDiv
					color='var(--background)'
					className={ style.header }
					gradientRotation={ 180 }
				>
					{/* <select>
						<option>Model</option>
					</select> */}
				</DottedDiv>
			</>}

			{ !chatId &&
				<h1>How can I help you today?</h1>
			}

			<DottedDiv
				color='var(--background)'
				className={ style.footer }
			>
				<div className={ style.input }>
					<textarea
						ref={ textAreaRef }
						rows={ 1 }
						disabled={ !chatId && busy }
						onInput={ () => resize() }
					/>
					<button
						onClick={ onSendClick }
						disabled={ busy }
					>
						<div className={ style.circle }></div>
						{ !busy ?
							<Image
								src={ sendIcon }
								alt=''
								width={ 20 }
							/>
							:
							<Image
								src={ spinnerIcon }
								alt=''
								width={ 20 }
								className={ style.spinner }
							/>
						}
					</button>
				</div>
			</DottedDiv>
		</div>
	);
}
