
import {
	AnimatePresence,
	motion,
} from 'framer-motion';

import {
	useState,
} from 'react';

import Image from 'next/image';

import grainImg from '@/assets/img/grain.png';
import crossIcon from '@/assets/icons/cross.svg';

import style from './modal.module.css';

export default function Modal({
	open,
	title,
	onCloseRequest,
	children,
}: {
	open?: boolean;
	title: string;
	onCloseRequest: () => void;
	children?: React.ReactNode;
})
{
	return (
		<AnimatePresence>
			{ open &&
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}

					className={ style['modal-container'] }
					key='modal'
				>
					<div
						className={ style.grain }
						style={{
							backgroundImage: `url(${grainImg.src})`,
						}}
						onClick={ () => onCloseRequest() }
					/>
					<motion.div
						initial={{
							y: -15,
							rotateX: 5,
						}}
						animate={{
							y: 0,
							rotateX: 0,
						}}
						exit={{
							y: 15,
							rotateX: -5,
						}}

						className={ style.modal }
					>
						<div className={ style.header }>
							<h2>{ title }</h2>
							<button
								className={ style.close }
								onClick={ () => onCloseRequest() }
							>
								<Image
									src={ crossIcon }
									alt='Close'
									width={ 20 }
									height={ 20 }
								/>
							</button>
						</div>
						{ children }
					</motion.div>
				</motion.div>
			}
		</AnimatePresence>
	);
}
