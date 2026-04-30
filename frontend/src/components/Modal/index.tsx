
import {
	AnimatePresence,
	motion,
} from 'framer-motion';

import grainImg from '@/assets/img/grain.png';

import style from './modal.module.css';
import { useState } from 'react';

export default function Modal({
	open,
	onCloseRequest,
	children,
}: {
	open?: boolean;
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
						onClick={() =>
						{
							onCloseRequest();
						}}
					/>
					<motion.div
						initial={{
							y: -20,
							rotateX: 25,
						}}
						animate={{
							y: 0,
							rotateX: 0,
						}}
						exit={{
							y: 20,
							rotateX: -25,
						}}

						className={ style.modal }
					>
						{ children }
					</motion.div>
				</motion.div>
			}
		</AnimatePresence>
	);
}
