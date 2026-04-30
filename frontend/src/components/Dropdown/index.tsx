
import {
	AnimatePresence,
	motion,
	type Variants,
} from 'framer-motion';

import Image, {
	type StaticImageData,
} from 'next/image';

import {
	useEffect,
	useRef,
	useState,
} from 'react';

import style from './dropdown.module.css';

export default function Dropdown({
	toggleElement,
	options = [],
	position,
}: {
	toggleElement: React.RefObject<HTMLElement | null>;
	options: {
		label: string;
		icon?: StaticImageData;
		onClick: () => Promise<void>;
	}[];
	position?: {
		x: string | number;
		y: string | number;
	};
})
{
	const [ open, setOpen ] = useState(false);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	useEffect(() =>
	{
		function onClickToggle()
		{
			setOpen(!open);
		}

		function clickedOutside(ev: MouseEvent)
		{
			if (dropdownRef.current && !dropdownRef.current.contains(ev.target as any)) {
				setOpen(false);
			}
		}

		if (toggleElement.current) {
			toggleElement.current.addEventListener('click', onClickToggle);
		}

		document.addEventListener('mousedown', clickedOutside);

		return () => {
			if (toggleElement.current) {
				toggleElement.current.removeEventListener('click', onClickToggle);
			}

			document.removeEventListener('mousedown', clickedOutside);
		};
	}, [ toggleElement, dropdownRef ]);


	const optionVariant: Variants = {
		open: {
			x: 0,
			opacity: 1,
		},
		closed: {
			x: -50,
			opacity: 0,
		},
	};

	const dropdownVariant: Variants = {
		open: {
			scale: 1,
			transition: {
				type: 'spring',
				duration: 0.5,
				delayChildren: 0.2,
				staggerChildren: 0.05,
			},
			translate: '0% 0%',
		},
		closed: {
			scale: 0,
			transition: {
				delay: 0.2,
			},
			translate: '0% 0%',
		},
	};

	return (
		<AnimatePresence initial={ false }>
			<motion.div
				animate={ open ? 'open' : 'closed' }
				initial={ 'closed' }
				variants={ dropdownVariant }
				ref={ dropdownRef }

				className={ style.dropdown }
				style={{
					transformOrigin: '0% 0%',
					top: position?.y,
					left: position?.x,
				}}
			>
				<AnimatePresence initial>
					{ options.map((value, index) =>
					(
						<motion.button
							variants={ optionVariant }
							className='default'

							onClick={async () =>
							{
								await value.onClick();
								setOpen(false);
							}}
							key={ index }
						>
							<div className={ style.icon }>
								{ value.icon && <Image
									src={ value.icon }
									alt=''
									width={ 20 }
									height={ 20 }
								/> }
							</div>
							<span>
								{ value.label }
							</span>
						</motion.button>
					)) }
				</AnimatePresence>
			</motion.div>
		</AnimatePresence>
	);
}
