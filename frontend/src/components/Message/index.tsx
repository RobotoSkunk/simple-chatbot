
import {
	Children,
	useRef,
	useState,
} from 'react';

import Image, {
	StaticImageData,
} from 'next/image';

import {
	host,
} from '@/data/api';

import Markdown from 'react-markdown';

import highlithting from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeMath from 'rehype-katex';
import remarkGfm from 'remark-gfm';

import style from './message.module.css';
import 'katex/dist/katex.min.css';

import TeSS from '../TeSS';

import refreshIcon from '@/assets/icons/refresh.svg';
import editIcon from '@/assets/icons/pen-line.svg';
import trashIcon from '@/assets/icons/trash.svg';
import leftIcon from '@/assets/icons/chevron-left.svg';
import rightIcon from '@/assets/icons/chevron-right.svg';
import checkIcon from '@/assets/icons/check.svg';
import crossIcon from '@/assets/icons/cross.svg';
import penIcon from '@/assets/icons/pen.svg';

function ButtonIcon({
	src,
	alt,
	disabled,
	onClick,
}: {
	src: string | StaticImageData;
	alt: string;
	disabled?: boolean;
	onClick: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
})
{
	return (
		<button
			className={ style['button-icon'] + ' default' }
			onClick={ onClick }
			disabled={ disabled }
		>
			<div></div>
			<Image
				src={ src }
				alt={ alt }
				width={ 16 }
				height={ 16 }
			/>
		</button>
	);
}


export default function Message({
	role,
	createdAt,
	children,
	messageId,
	content,
	contentIndex,
	contentCount,
	editedByUser,
	isBusy,

	onRegenerate,
	onEdit,
	onDelete,
	onLoadIndex,
}: {
	role: 'user' | 'assistant';
	createdAt?: Date;
	children?: React.ReactNode;
	messageId: string;
	content: string;
	contentIndex: number;
	contentCount: number;
	editedByUser: boolean;
	isBusy?: boolean;

	onRegenerate: () => Promise<void>;
	onEdit: (newContent: string) => void;
	onDelete: () => Promise<void>;
	onLoadIndex: (index: number, content: string, editedByUser: boolean) => Promise<void>;
})
{
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [ editing, setEditing ] = useState(false);

	function getFormattedDate()
	{
		if (!createdAt) {
			return '';
		}

		let format = '';

		if (new Date().toLocaleDateString() !== createdAt.toLocaleDateString()) {
			format = createdAt.toLocaleDateString() + ' ';
		}

		format += createdAt.getHours().toString().padStart(2, '0') + ':' +
				createdAt.getMinutes().toString().padStart(2, '0');

		return format;
	}

	async function switchIndex(direction: -1 | 1)
	{
		const newIndex = contentIndex + direction;

		if (newIndex < 0 || newIndex >= contentCount) {
			return;
		}

		const response = await fetch(`${host}/vault/-/chat/-/message/${messageId}/set-index`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				index: newIndex,
			}),
		});

		const json = await response.json() as {
			success: boolean;
			content: string;
			edited_by_user: boolean;
			error?: string;
		};

		if (json.success) {
			await onLoadIndex(newIndex, json.content, json.edited_by_user);
		}
	}

	return (
		<div className={ [
			style.container,
			style[`role-${role}`],
		].join(' ') }>
			<div className={ style.message }>
				<div className={ style.content }>
					{ editing ?
						<textarea
							defaultValue={ content }
							ref={ textareaRef }
						/>
						:
						Children.map(children, child =>
						(typeof child === 'string' ?
							<Markdown
								remarkPlugins={[
									remarkMath,
									remarkGfm,
								]}
								rehypePlugins={[
									rehypeMath,
									highlithting,
								]}
							>
								{ child }
							</Markdown>
							: child
						))
					}
				</div>
				<div className={ style.triangle }>
					<div className={ style.circle }></div>
				</div>
				<div className={ style.info }>
					{ editedByUser &&
						<Image
							src={ penIcon }
							alt='Edited by the user'
							title='Edited by the user'
							width={ 12 }
							height={ 12 }

							className={ style['edited-icon'] }
						/>
					}
					{ createdAt && <span className={ style.date }>{ getFormattedDate() }</span> }
				</div>
				{ !messageId.startsWith(':new') && content.length > 0 &&
					<div className={ style.footer }>
						{ contentCount > 1 &&
							<div className={ style.options }>
								<ButtonIcon
									src={ leftIcon }
									alt='Load previous generated message'
									disabled={ isBusy }
									onClick={ async () => await switchIndex(-1) }
								/>
								<span>
									{ contentIndex + 1 }/{ contentCount }
								</span>
								<ButtonIcon
									src={ rightIcon }
									alt='Load next generated message'
									disabled={ isBusy }
									onClick={ async () => await switchIndex(1) }
								/>
							</div>
						}
						<div className={ style.options }>
							{ editing ? <>
								<ButtonIcon
									src={ checkIcon }
									alt='Confirm changes'
									disabled={ isBusy }
									onClick={ async () => {
										const newContent = textareaRef.current?.value ?? content;

										if (newContent !== content) {
											const response = await fetch(`${host}/vault/-/chat/-/message/${messageId}`, {
												method: 'PATCH',
												headers: {
													'Content-Type': 'application/json',
												},
												body: JSON.stringify({
													content: newContent,
												}),
											});

											const json = await response.json() as { success: boolean, error?: string };

											if (json.success) {
												onEdit(newContent);
											}
										}

										setEditing(false);
									} }
								/>
								<ButtonIcon
									src={ crossIcon }
									alt='Cancel changes'
									disabled={ isBusy }
									onClick={ async () => setEditing(false) }
								/>
							</> : <>
								{ role === 'assistant' &&
									<ButtonIcon
										src={ refreshIcon }
										alt='Regenerate message'
										disabled={ isBusy }
										onClick={ onRegenerate }
									/>
								}
								<ButtonIcon
									src={ editIcon }
									alt='Edit message'
									disabled={ isBusy }
									onClick={ async () => setEditing(true) }
								/>
								<ButtonIcon
									src={ trashIcon }
									alt='Delete message'
									disabled={ isBusy }
									onClick={ async () => {
										const confirmation = confirm(
											`Are you sure you want to delete this chat?\n\nThis can't be undone.`
										);

										if (confirmation) {
											const response = await fetch(`${host}/vault/-/chat/-/message/${messageId}`, {
												method: 'DELETE',
											});

											const json = await response.json() as { success: boolean, error?: string };

											if (json.success) {
												onDelete();
											}
										}
									} }
								/>
							</>
							}
						</div>
					</div>
				}
			</div>
		</div>
	);
}
