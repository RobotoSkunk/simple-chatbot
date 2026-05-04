
import {
	AnimatePresence,
	motion,
	MotionStyle,
} from 'framer-motion';

import {
	useState,
} from 'react';

import Image from 'next/image';

import grainImg from '@/assets/img/grain.png';
import crossIcon from '@/assets/icons/cross.svg';

import modalStyle from './modal.module.css';

export default function Modal({
	open,
	title,
	onCloseRequest,
	children,
	style,
}: {
	open?: boolean;
	title: string;
	onCloseRequest: () => void;
	children?: React.ReactNode;
	style?: MotionStyle;
})
{
	return (
		<AnimatePresence>
			{ open &&
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}

					className={ modalStyle['modal-container'] }
					key='modal'
				>
					<div
						className={ modalStyle.grain }
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

						style={ style }
						className={ modalStyle.modal }
					>
						<div className={ modalStyle.header }>
							<h2>{ title }</h2>
							<button
								className={ modalStyle.close }
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
