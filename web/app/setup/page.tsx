import {
	useDeferredValue,
	useEffect,
	useState,
} from 'react';

import {
	AnimatePresence,
	motion,
	stagger,
	type Variants,
} from 'motion/react';

import {
	type FeedbackType,
	type Matcher,
	type OptionsType,
	ZxcvbnFactory,
} from '@zxcvbn-ts/core';

import {
	matcherPwnedFactory,
} from '@zxcvbn-ts/matcher-pwned';

import * as zxcvbnCommon from '@zxcvbn-ts/language-common';
import * as zxcvbnDictionaryEn from '@zxcvbn-ts/language-en';
import * as zxcvbnDictionaryEsEs from '@zxcvbn-ts/language-es-es';

import '../globals.css';
import './page.css';

const zxcvbnOptions = {
	translations: zxcvbnDictionaryEn.translations,
	dictionary: {
		...zxcvbnCommon.dictionary,
		...zxcvbnDictionaryEn.dictionary,
		...zxcvbnDictionaryEsEs.dictionary,
		userInputs: [
			'chatbot',
			'chat',
			'bot',
			'ai',
			'llm',
			'ollama',
			'bun',
			'javascript',
			'typescript',
			'type',
			'java',
			'script',
			'github',
			'gitlab',
			'mcp',
			'server',
			'local',
		],
	},
	graphs: zxcvbnCommon.adjacencyGraphs,
	useLevenshteinDistance: true,
} satisfies OptionsType;

const zxcvbn = new ZxcvbnFactory(zxcvbnOptions, {
	pwned: matcherPwnedFactory(fetch),
});

function offlineScoreFromGuesses(guesses: number)
{
	if (guesses < 1e8) {
		return 0;
	}
	if (guesses < 1e11) {
		return 1;
	}
	if (guesses < 1e14) {
		return 2;
	}
	if (guesses < 1e17) {
		return 3;
	}

	return 4;
}

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
		label: `Absurdly Insecure`,
		color: '#475569',
	},
	{
		label: 'Very Insecure',
		color: '#f43f5e',
	},
	{
		label: 'Insecure',
		color: '#f43f5e',
	},
	{
		label: 'Fair',
		color: '#eab308',
	},
	{
		label: 'Secure',
		color: '#84cc16',
	},
];

export default function Setup()
{
	const [ section, setSection ] = useState(0);

	const [ password, setPassword ] = useState('');
	const passwordDeferred = useDeferredValue(password);
	const [ repeatedPassword, setRepeatedPassword ] = useState('');

	const [ passwordScore, setPasswordScore ] = useState(0);
	const [ showPassword, setShowPassword ] = useState(false);
	const [ feedback, setFeedback ] = useState<FeedbackType>({ warning: null, suggestions: [] });

	function changeSection(direction: -1 | 1)
	{
		setSection(section + direction);
	}

	function passwordIsSecure()
	{
		return passwordScore >= 3;
	}

	async function checkPasswordStrength()
	{
		const result = await zxcvbn.checkAsync(passwordDeferred);
		const score = offlineScoreFromGuesses(result.guesses);

		setPasswordScore(score);
		setFeedback(result.feedback);
	}

	useEffect(() =>
	{
		checkPasswordStrength();
	}, [ passwordDeferred ]);


	const sections = [
		( // Welcome
			<>
				<motion.h1
					variants={ variants }
					key='welcome-title'
				>
					Welcome to your Personal Chatbot
				</motion.h1>
				<motion.button
					variants={ variants }
					onClick={ () => changeSection(1) }
					key='welcome-button'
				>
					Next
				</motion.button>
			</>
		),
		( // Password form
			<form>
				<motion.h1
					variants={ variants }
					layout
				>
					Let's create a password
				</motion.h1>
				<motion.p
					variants={ variants }
					style={{ marginBottom: 22 }}
					layout
				>
					This password will be used to authenticate you and encrypt all your data,<br/>
					so make sure it's unique and secure. <b>Don't lose your password</b>.
				</motion.p>
				<motion.div
					className='input-field'
					variants={ variants }
					layout
				>
					<label htmlFor='password-input'>Password</label><br/>
					<input
						id='password-input'
						type='password'
						placeholder='••••••••••••'
						aria-label='Password input field'

						onInput={ (ev) => setPassword(ev.currentTarget.value) }
					/>
				</motion.div>
				{ passwordDeferred.length > 0 && <>
					<div style={{ minHeight: 190 }}>
						<motion.div
							className='input-field'
							variants={ variants }
							layout
						>
							<label htmlFor='repeat-password-input'>Repeat password</label><br/>
							<input
								id='repeat-password-input'
								type='password'
								placeholder='••••••••••••'
								aria-label='Repeat password input field'

								onInput={ (ev) => setRepeatedPassword(ev.currentTarget.value) }
							/>
						</motion.div>
						<motion.div
							variants={ variants }
							className='score-container'
						>
							<span className='info-label'>
								{ scores[passwordScore]!.label }
							</span>
							<motion.div className='score'>
								<motion.div
									className='bar'
									animate={{
										width: `${(passwordScore / (scores.length - 1)) * 100}%`,
										backgroundColor: scores[passwordScore]!.color,
									}}
								/>
							</motion.div>
						</motion.div>
						{ passwordIsSecure() && passwordDeferred !== repeatedPassword &&
							<motion.p
								className='warning-label'
								variants={ variants }
								layout
							>
								The passwords don't match.
							</motion.p>
						}
						{ feedback.warning &&
							<motion.p
								className='warning-label'
								variants={ variants }
								layout
							>
								{ feedback.warning }
							</motion.p>
						}
						<div className='suggestions'>
							<ul>
								{ passwordDeferred.length > 0 && feedback.suggestions.map((v, i) =>
									<motion.li
										key={ i }
										variants={ variants }
										className='info-label'
										layout
									>
										{ v }
									</motion.li>
								) }
							</ul>
						</div>
						{ (passwordIsSecure() && passwordDeferred === repeatedPassword) &&
							<motion.button
								variants={ variants }
								style={{ marginTop: 22 }}
								onClick={ () => changeSection(1) }
							>
								Next
							</motion.button>
						}
					</div>
				</> }
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
