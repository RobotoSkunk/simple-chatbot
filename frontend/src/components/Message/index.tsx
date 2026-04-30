
import {
	Children,
} from 'react';

import Image from 'next/image';
import Markdown from 'react-markdown';

import highlithting from 'rehype-highlight';
import remarkMath from 'remark-math';
import rehypeMath from 'rehype-katex';
import remarkGfm from 'remark-gfm';

import style from './message.module.css';
import 'katex/dist/katex.min.css';

import icon from '@/assets/img/assistant.png';


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
	return (
		<div className={ [
			style.container,
			style[role],
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
					{ createdAt &&
						<span>
							{ new Date().toLocaleDateString() !== createdAt.toLocaleDateString() ? createdAt.toLocaleDateString() + ' ' : '' }
							{ createdAt.getHours().toString().padStart(2, '0') }:{ createdAt.getMinutes().toString().padStart(2, '0') }
						</span>
					}
				</div>
			</div>
		</div>
	);
}
