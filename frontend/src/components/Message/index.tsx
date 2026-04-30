
import {
	Children,
} from 'react';

import Image, {
	StaticImageData,
} from 'next/image';
import Markdown from 'react-markdown';

import highlithting from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeMath from 'rehype-katex';
import remarkGfm from 'remark-gfm';

import style from './message.module.css';
import 'katex/dist/katex.min.css';

import icon from '@/assets/img/assistant.png';
import refreshIcon from '@/assets/icons/refresh.svg';
import editIcon from '@/assets/icons/pen-line.svg';
import trashIcon from '@/assets/icons/trash.svg';
import leftIcon from '@/assets/icons/chevron-left.svg';
import rightIcon from '@/assets/icons/chevron-right.svg';


function ButtonIcon({
	src,
	alt,
}: {
	src: string | StaticImageData;
	alt: string;
})
{
	return (
		<button
			className={ style['button-icon'] }
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
}: {
	role: 'user' | 'assistant';
	createdAt?: Date;
	children?: React.ReactNode;
})
{
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

	return (
		<div className={ [
			style.container,
			style[`role-${role}`],
		].join(' ') }>
			{ role === 'assistant' && <>
				<Image
					src={ icon }
					width={ 50 }
					height={ 50 }
					alt=''
				/>
			</> }
			<div className={ style.message }>
				<div className={ style.content }>
					{ Children.map(children, child =>
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
					))}
				</div>
				<div className={ style.triangle }>
					<div className={ style.circle }></div>
				</div>
				<div className={ style.info }>
					<div className={ style.options }>
						{ role === 'assistant' &&
							<ButtonIcon
								src={ refreshIcon }
								alt='Regenerate message'
							/>
						}
						<ButtonIcon
							src={ editIcon }
							alt='Edit message'
						/>
						<ButtonIcon
							src={ trashIcon }
							alt='Delete message'
						/>
					</div>
					{ createdAt && <span>{ getFormattedDate() }</span> }
				</div>
				<div className={ style.versions }>
					<ButtonIcon
						src={ leftIcon }
						alt='Load previous generated message'
					/>
					<span>
						1/3
					</span>
					<ButtonIcon
						src={ rightIcon }
						alt='Load next generated message'
					/>
				</div>
			</div>
		</div>
	);
}
