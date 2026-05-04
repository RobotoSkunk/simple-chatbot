
'use client';

import {
	useRef,
	useEffect,
	useContext,
	useState,
	useLayoutEffect,
} from 'react';

import {
	useImmer,
} from 'use-immer';

import {
	useRouter,
} from 'next/navigation';

import {
	AnimatePresence,
	motion,
} from 'framer-motion';

import {
	type ReadableStream,
} from 'stream/web';

import {
	ChatsContext,
} from '@/contexts/chats';

import {
	host,
} from '@/data/api';

import {
	smooth,
} from '@/data/transitions';

import Image from 'next/image';

import Message from '@/components/Message';
import DottedDiv from '@/components/DottedDiv';
import TeSS from '@/components/TeSS';

import style from './chat.module.css';

import sendIcon from '@/assets/icons/send.svg';
import stopIcon from '@/assets/icons/stop.svg';
import spinnerIcon from '@/assets/icons/spinner.svg';


type ChatMessage = MessageData & {
	hideControls?: boolean;
};

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
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

	const [ messages, setMessages ] = useImmer<ChatMessage[]>([]);
	const [ firstLoad, setFirstLoad ] = useState(true);
	const [ busy, setBusy ] = useState(false);
	const [ status, setStatus ] = useState<ChunkStatusTypes>('none');

	const [ abortController, setAbortController ] = useState<AbortController | null>(null);

	let alreadyCalled = false;


	useEffect(() =>
	{
		resize();

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
				const json: ChatMessage[] = await response.json();
				console.log(json);

				setMessages(json);
			})();
		}
	}, [ ]);

	useLayoutEffect(() =>
	{
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTo({
				top: messagesContainerRef.current.scrollHeight,
				behavior: firstLoad ? 'instant' :'smooth',
			});

			if (messages.length > 0) {
				setFirstLoad(false);
			}
		}
	}, [ messages ]);

	async function parseBody(
		body: globalThis.ReadableStream<Uint8Array<ArrayBuffer>>,
		callback: (chunk: ChunkResponse) => void)
	{
		const stream = body.pipeThrough(new TextDecoderStream('utf-8')) as ReadableStream;

		for await (const value of stream) {
			const parts: string[] = (value as string).split('\n').filter(v => v.length > 0);

			for (const part of parts) {
				let chunk: ChunkResponse;

				try {
					chunk = JSON.parse(part);
				} catch (error) {
					console.warn('Illegal JSON', error);
					console.log(value, part);
					continue;
				}

				if (chunk.type != 'status') {
					callback(chunk);
				} else {
					setStatus(chunk.status);
				}
			}
		}
	}

	async function sendMessage(content?: string)
	{
		let userMessageId = crypto.randomUUID();
		let assistantMessageId = crypto.randomUUID();

		const message: ChatMessage = {
			id: assistantMessageId,
			role: 'assistant',
			content: '',
			created_at: Date.now(),
			generation_time: 0,
			content_count: 1,
			edited_by_user: false,
			index: 0,
			hideControls: true,
		};

		if (content) {
			setMessages([
				...messages,
				{
					id: userMessageId,
					role: 'user',
					content: content,
					created_at: Date.now(),
					generation_time: 0,
					content_count: 1,
					edited_by_user: false,
					index: 0,
				},
				message,
			]);
		} else {
			setMessages([
				...messages,
				message,
			]);
		}

		const controller = new AbortController();
		setAbortController(controller);

		try {
			const response = await fetch(`${host}/vault/${vaultId}/chat/${chatId}/message`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ content }),
				signal: controller.signal,
			});

			if (response.body) {
				await parseBody(response.body, (chunk) => 
				{
					switch (chunk.type) {
						case 'writing': {
							setStatus('typing');

							setMessages(m => {
								const msg = m.find(m => m.id === assistantMessageId);

								if (msg) {
									msg.content += chunk.token;
								}
							});
							break;
						}
						case 'end': {
							setStatus('none');

							setMessages(m => {
								const msg = m.find(m => m.id === assistantMessageId);

								if (msg) {
									msg.hideControls = false;
								}
							});
							break;
						}
						case 'message_data': {
							if (!content) {
								break;
							}

							setMessages(m => {
								const targetId = chunk.role === 'assistant' ? assistantMessageId : userMessageId;
								const msg = m.find(m => m.id === targetId);

								if (msg) {
									msg.id = chunk.message_id;
									msg.generation_time = chunk.elapsed_time;
								}

								if (chunk.role === 'assistant') {
									assistantMessageId = chunk.message_id;
								} else {
									userMessageId = chunk.message_id;
								}
							});

							break;
						}
						case 'error': {
							const messageIndex = messages.findIndex(m => m.id === assistantMessageId);
							const messagesCopy = [... messages];
							messagesCopy.splice(messageIndex, 1);

							setMessages(messagesCopy);
							break;
						}
					}
				});
			}
		} catch (error) {
			if ((error as Error).name !== 'AbortError') {
				console.error(error);
			}
		}
	}

	async function onSendClick()
	{
		if (!textAreaRef.current) {
			return;
		}

		if (busy && abortController) {
			abortController.abort();
			setBusy(false);

			setMessages(m => {
				for (const message of m) {
					message.hideControls = false;
				}
			});
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

	async function onRegenerateMessage(message: ChatMessage) {
		setBusy(true);

		const controller = new AbortController();
		setAbortController(controller);

		try {
			const response = await fetch(`${host}/vault/${vaultId}/chat/${chatId}/message/${message.id}/regenerate`, {
				method: 'POST',
				signal: controller.signal,
			});

			setMessages(m => {
				const msg = m.find(m => m.id === message.id);

				if (msg) {
					msg.index++;
					msg.content_count++;
					msg.content = '';
					msg.edited_by_user = false;
					msg.hideControls = true;
				}
			});

			if (response.body) {
				await parseBody(response.body, (chunk) =>
				{
					switch (chunk.type) {
						case 'writing': {
							setStatus('typing');

							setMessages(m => {
								const msg = m.find(m => m.id === message.id);

								if (msg) {
									msg.content += chunk.token;
								}
							});
							break;
						}
						case 'end': {
							setBusy(false);
							setStatus('none');

							setMessages(m => {
								const msg = m.find(m => m.id === message.id);

								if (msg) {
									msg.hideControls = false;
								}
							});
							break;
						}
						case 'error': {
							const messagesCopy = [... messages];
							const messageIndex = messagesCopy.findIndex(m => m.id === ':new_assistant');
							messagesCopy.splice(messageIndex, 1);

							setMessages(messagesCopy);
							break;
						}
					}
				});
			}
		} catch (error) {
			if ((error as Error).name !== 'AbortError') {
				console.error(error);
			}
		}
	}

	function resize()
	{
		if (!textAreaRef.current) {
			return;
		}

		textAreaRef.current.style.height = '';
		let height = textAreaRef.current.scrollHeight - 20; // 20 is the padding size

		if (height > 350) {
			height = 350
		}

		textAreaRef.current.style.height = height + 'px';
	}

	return (
		<motion.div
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={ smooth }

			className={ [
				style.container,
				!chatId ? style.welcome : '',
			].join(' ') }
		>
			{ chatId && <>
				<div
					id='messages-container'
					className={ style.messages }
					ref={ messagesContainerRef }
				>
					<div className={ style.wrapper }>
						{ messages && messages.map((v, i) =>
						(
							<Message
								key={ v.id }
								createdAt={ new Date(v.created_at) }
								role={ v.role }
								isBusy={ busy }
								showControls={ !v.hideControls }

								messageId={ v.id }
								content={ v.content }
								contentCount={ v.content_count }
								contentIndex={ v.index }
								editedByUser={ v.edited_by_user }

								onEdit={ (newContent) => {
									setMessages(m => {
										const msg = m.find(m => m.id === v.id);

										if (msg) {
											msg.index++;
											msg.content_count++;
											msg.content = newContent;
											msg.edited_by_user = true;
										}
									});
								} }
								onDelete={ async () => {
									const index = messages.findIndex(m => m.id === v.id);

									const newMessages = [ ...messages ];
									newMessages.splice(index, 1);

									setMessages(newMessages);
								} }
								onLoadIndex={ async (newIndex, newContent, editedByUser) => {
									setMessages(m => {
										const msg = m.find(m => m.id === v.id);

										if (msg) {
											msg.index = newIndex;
											msg.content = newContent;
											msg.edited_by_user = editedByUser;
										}
									});
								} }
								onRegenerate={ async () => await onRegenerateMessage(v) }
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
						<AnimatePresence>
							{ messages.length > 0 &&
								<motion.div
									initial={{ x: -50, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									exit={{ x: -50, opacity: 0 }}
									transition={ smooth }

									className={ style['tess-container'] }
								>
									<div className={ style.background }/>
									<TeSS
										backgroundColor='#263c5d'
										className={ style.tess }
										status={ status }
									/>
								</motion.div>
							}
						</AnimatePresence>
					</div>
				</div>
				<DottedDiv
					color='var(--background)'
					className={ style.header }
					gradientRotation={ 180 }
				/>
			</>}

			{ !chatId && <>
				<div style={{ position: 'relative' }}>
					<TeSS
						className={ style.tess }
						status={ status }
					/>
				</div>
				<h1>How can I help you today?</h1>
			</> }

			<DottedDiv
				color='var(--background)'
				className={ style.footer }
			>
				<div className={ style.input }>
					<textarea
						ref={ textAreaRef }
						id='main-input'
						rows={ 1 }
						disabled={ busy }
						onInput={ resize }
						onKeyDown={ (ev) => {
							if (!ev.shiftKey && ev.key.toLowerCase() === 'enter') {
								onSendClick();
							}
						} }

						className='default'
					/>
					<button
						onClick={ onSendClick }
						// disabled={ busy }
						className='default'
					>
						<div className={ style.circle }></div>
						{ !busy ?
							<Image
								src={ sendIcon }
								alt=''
								width={ 20 }
							/>
							: <>
								<Image
									src={ spinnerIcon }
									alt=''
									width={ 20 }
									className={ style.spinner }
								/>
								<Image
									src={ stopIcon }
									alt=''
									width={ 20 }
									className={ style.stop }
								/>
							</>
						}
					</button>
				</div>
				<span>
					Remember, AI models are dumb and you shouldn't rely on them to get "definitive answers", but if you
					do, at least make sure what the AI says is true.
				</span>
			</DottedDiv>
		</motion.div>
	);
}
