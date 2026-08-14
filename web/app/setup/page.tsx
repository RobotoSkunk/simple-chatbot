import {
	useState,
} from 'react';

import {
	AnimatePresence,
	motion,
	stagger,
	type Variants,
} from 'motion/react';

import '../globals.css';
import './page.css';

const variants = {
	hide: {
		y: 20,
		opacity: 0,
	},
	show: {
		y: 0,
		opacity: 1,
	},
} satisfies Variants;

const scores = [
	{
		label: 'Very Insecure',
		color: '#475569',
	},
	{
		label: 'Insecure',
		color: '#f43f5e',
	},
	{
		label: 'Decent',
		color: '#eab308',
	},
	{
		label: 'Good',
		color: '#84cc16',
	},
	{
		label: 'Excelent',
		color: '#10b981',
	},
];

export default function Setup()
{
	const [ section, setSection ] = useState(0);

	function changeSection(direction: -1 | 1)
	{
		setSection(section + direction);
	}

	const sections = [
		( // Welcome
			<>
				<motion.h1 variants={ variants }>
					Welcome to your Personal Chatbot
				</motion.h1>
				<motion.button
					variants={ variants }
					onClick={ () => changeSection(1) }
				>
					Next
				</motion.button>
			</>
		),
		( // Password form
			<form>
				<motion.h1 variants={ variants }>
					Let's create a password
				</motion.h1>
				<motion.p variants={ variants } style={{ marginBottom: 22 }}>
					The password will be used to authenticate you and encrypt all your data, so make sure it is unique and secure.
				</motion.p>
				<motion.div variants={ variants }>
					<label htmlFor='password-input'>Password</label><br/>
					<input
						id='password-input'
						type='password'
						placeholder='••••••••••••'
						aria-label='Password input field'
					/>
				</motion.div>
				<motion.div variants={ variants }>
					<label htmlFor='repeat-password-input'>Repeat password</label><br/>
					<input
						id='repeat-password-input'
						type='password'
						placeholder='••••••••••••'
						aria-label='Repeat password input field'
					/>
				</motion.div>
				<motion.button
					variants={ variants }
					style={{ marginTop: 22 }}
					onClick={ () => changeSection(1) }
				>
					Next
				</motion.button>
			</form>
		),
	];

	return (
		<div className='app'>
			<AnimatePresence mode='wait'>
				<motion.div
					variants={{
						show: {
							transition: {
								delayChildren: stagger(0.13, { startDelay: 0.17 }),
							},
						},
						hide: {
							transition: {
								delayChildren: stagger(0.09, { from: 'last' }),
							},
						},
					}}

					initial='hide'
					animate='show'
					exit='hide'

					key={ section }
				>
					{ sections[section] }
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
