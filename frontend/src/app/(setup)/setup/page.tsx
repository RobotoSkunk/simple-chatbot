
'use client';

import {
	useDeferredValue,
	useEffect,
	useState,
} from 'react';

import {
	motion,
	AnimatePresence,
	MotionProps,
} from 'framer-motion';

import {
	type FeedbackType,
	zxcvbnAsync,
	zxcvbnOptions,
} from '@zxcvbn-ts/core';

import {
	matcherPwnedFactory,
} from '@zxcvbn-ts/matcher-pwned';

import Image from 'next/image';
import bcrypt from 'bcryptjs';

import * as zxcvbnCommon from '@zxcvbn-ts/language-common';
import * as zxcvbnDictionaryEn from '@zxcvbn-ts/language-en';
import * as zxcvbnDictionaryEsEs from '@zxcvbn-ts/language-es-es';

import TeSS from '@/components/TeSS';

import infoIcon from '@/assets/icons/info.svg';
import eyeIcon from '@/assets/icons/eye.svg';
import eyeSlashIcon from '@/assets/icons/eye-slash.svg';

import style from './page.module.css';

zxcvbnOptions.setOptions({
	translations: zxcvbnDictionaryEn.translations,
	dictionary: {
		...zxcvbnCommon.dictionary,
		...zxcvbnDictionaryEsEs.dictionary,
	},
	graphs: zxcvbnCommon.adjacencyGraphs,
});

const matcherPwned = matcherPwnedFactory(fetch, zxcvbnOptions);
zxcvbnOptions.addMatcher('pwned', matcherPwned);

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

const commonProperties = {
	variants: {
		show: {
			y: 0,
			opacity: 1,
		},
		hide: {
			y: -50,
			opacity: 0,
		},
	},
	initial: 'hide',
	animate: 'show',
	exit:    'hide',
	layout: true,
	transition: {
		type: 'spring',
		stiffness: 300,
		damping: 30,
	},
} satisfies MotionProps;

export default function Page()
{
	const [ section, setSection ] = useState(0);

	const [ password, setPassword ] = useState('');
	const [ repeatPassword, setRepeatPassword ] = useState('');
	const [ showPassword, setShowPassword ] = useState(false);
	const [ showFeedback, setShowFeedback ] = useState(false);
	const passwordDeferred = useDeferredValue(password, '');
	const [ feedback, setFeedback ] = useState<FeedbackType>({ warning: null, suggestions: [] });
	const [ passwordScore, setPasswordScore ] = useState(0);

	function moveToSection(direction: 1 | -1) {
		setSection(section + direction);
	}

	useEffect(() =>
	{
		(async () =>
		{
			const result = await zxcvbnAsync(passwordDeferred);

			setFeedback(result.feedback);
			setPasswordScore(result.score);
		})();
	}, [ passwordDeferred ]);

	const sections: React.ReactElement[] = [
		( // Welcome
			<motion.div
				{ ...commonProperties }
			>
				<h1>Welcome to your Personal Chatbot</h1>
				<button onClick={ () => moveToSection(1) }>Next</button>
			</motion.div>
		),
		( // Password configuration
			<motion.div
				{ ...commonProperties }
			>
				<h1>Create a password</h1>
				<p>This password will be used to <i>encrypt</i> your content with the chatbot.</p>

				<form
					onSubmit={ async (ev) => {
						ev.preventDefault();

						if (passwordScore < 3 || password !== repeatPassword) {
							setShowFeedback(true);
							return;
						}

						const salt = await bcrypt.genSalt(10);
						const pass = await bcrypt.hash(password, salt.toString());

						console.log('hash:', pass);
						console.log('salt:', salt);
						moveToSection(1);
					} }
				>
					<label>
						<span>Password</span>
						<div className={ style.input }>
							<input
								type={ showPassword ? 'text' :'password' }
								name='password'
								onInput={ (ev) => setPassword(ev.currentTarget.value) }
							/>
							<button
								className={ [
									style.action,
									'default',
									showFeedback ? style.active : '',
								].join(' ') }

								onClick={ (ev) => {
									ev.preventDefault();
									setShowFeedback(!showFeedback);
								} }
							>
								<Image
									src={ infoIcon }
									alt={ `${ showPassword ? 'Hide' : 'Show' } suggestions` }
									title={ `${ showPassword ? 'Hide' : 'Show' } suggestions` }
									width={ 30 }
									height={ 30 }
								/>
							</button>
							<AnimatePresence>
								{ showFeedback && (
									feedback.suggestions.length > 0 || feedback.warning ||
									password !== repeatPassword
								) &&
									<motion.div
										className={ style.info }
										style={{
											transformOrigin: '0% 0%',
										}}

										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										exit={{ scale: 0 }}
									>
										<ul>
											{ passwordDeferred !== repeatPassword &&
												<li>Passwords don't match.</li>
											}
											{ feedback.suggestions.map((v, i) =>
											(
												<li key={ i }>{ v }</li>
											)) }
										</ul>
									</motion.div>
								}
							</AnimatePresence>
						</div>
					</label>
					<label>
						<span>Repeat password</span>
						<div className={ style.input }>
							<input
								type={ showPassword ? 'text' :'password' }
								onInput={ (ev) => setRepeatPassword(ev.currentTarget.value) }
							/>
							<button
								className={ `${style.action} default` }
								onClick={ (ev) => {
									ev.preventDefault();
									setShowPassword(!showPassword);
								} }
							>
								<Image
									src={ showPassword ? eyeIcon : eyeSlashIcon }
									alt='Show password'
									title='Show password'
									width={ 30 }
									height={ 30 }
								/>
							</button>
						</div>
					</label>

					<div className={ style.score }>
						<div className={ style.bar }>
							<motion.div
								animate={{
									width: (passwordScore / (scores.length - 1)) * 300,
									backgroundColor: scores[passwordScore].color,
								}}
							/>
						</div>
						<span>{ scores[passwordScore].label }</span>
					</div>

					<button>Continue</button>
				</form>
			</motion.div>
		),
		( // Setting up
			<motion.div
				{ ...commonProperties }
			>
				<h1>Welcome to your Personal Chatbot</h1>
				<button onClick={ () => moveToSection(1) }>Next</button>
			</motion.div>
		),
	];

	return (
		<div className={ style.container }>
			<AnimatePresence mode='wait'>
				<motion.div
					key='tess'
					className={ style['tess-container'] }
					{ ...commonProperties }
				>
					<TeSS
						status='none'
						className={ style.tess }
					/>
				</motion.div>
				{ sections.map((v, i) =>
				{
					if (section === i) {
						return {
							...v,
							key: `section-${i}`,
						};
					}
				}) }
			</AnimatePresence>
		</div>
	);
}
