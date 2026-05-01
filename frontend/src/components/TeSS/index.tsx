
'use client';

import {
	useEffect,
	useRef,
	useState,
} from 'react';

import {
	motion,
} from 'framer-motion';


const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const clamp = (x: number, min: number, max: number) => x < min ? min : (x > max ? max : x);

export default function TeSS({
	followCursor,
	className,
}: {
	followCursor?: boolean;
	className?: string;
})
{
	const [ id, setId ] = useState('');
	const [ blinkDelta, setBlinkDelta ] = useState(0);
	const [ mouseXDelta, setMouseXDelta ] = useState(0);
	const [ mouseYDelta, setMouseYDelta ] = useState(0);
	const svgRef = useRef<SVGGElement | null>(null);

	async function blinkLoop()
	{
		await wait(5000 + Math.random() * 5000);
		setBlinkDelta(1);

		await wait(150 + Math.random() * 150);
		setBlinkDelta(0);

		blinkLoop();
	}

	useEffect(() => {
		setId(crypto.randomUUID());
		blinkLoop();

		function onMouseMove(ev: MouseEvent)
		{
			if (!svgRef.current) {
				return;
			}

			const svg = svgRef.current;
			const box = svg.getBoundingClientRect();

			const middleX = box.x + box.width / 2;
			const middleY = box.y + box.height / 2;

			setMouseXDelta(clamp((ev.x - middleX) / 760 * 4, -4, 4));
			setMouseYDelta(clamp((ev.y - middleY) / 760 * 4, -4, 4));
		}

		if (followCursor) {
			document.addEventListener('mousemove', onMouseMove);
		}

		return () => {
			if (followCursor) {
				document.removeEventListener('mousemove', onMouseMove);
			}
		};
	}, [ ]);

	return (
		<svg
			width='100mm'
			height='100mm'
			viewBox='0 0 100 100'
			version='1.1'
			className={ className }
		>
			<defs>
				<clipPath
					clipPathUnits='userSpaceOnUse'
					id={ `clipPath19-${id}` }
				>
					<circle
						cx={ 41.884613 }
						cy={ 62.300571 }
						r={ 6.3 }
						// r={ 6.0135441 }
					/>
				</clipPath>
				<clipPath
					clipPathUnits='userSpaceOnUse'
					id={ `clipPath21-${id}` }
				>
					<circle
						cx={ 58.197456 }
						cy={ 65.376465 }
						r={ 4.7 }
						// r={ 4.3891959 }
					/>
				</clipPath>
			</defs>
			<motion.g // inkscape:label='antenna-right'
				animate={{
					rotate: -5,
				}}
				transition={{
					repeat: Infinity,
					duration: 3,
					repeatType: 'mirror',
					type: 'tween',
				}}
			>
				<g
					style={{
						transform: 'matrix(0.4722695,-0.29136478,0.29136478,0.4722695,12.341152,32.767473)',
					}}
				>
					<rect
						style={{ fill: '#ffc747' }}
						width='10.650013'
						height='43.970207'
						x='22.701336'
						y='22.873423'
					/>
					<circle
						style={{
							fill: '#ffc747',
							stroke: 'var(--background)',
							strokeWidth: 10,
							paintOrder: 'stroke fill markers',
						}}
						cx='28.026342'
						cy='22.873423'
						r='10.836852'
					/>
					<rect
						style={{ opacity: 0 }}
						width='5.9098639'
						height='24.399776'
						x='-11.805406'
						y='-95.859474'
						transform='matrix(-1.8020741,-1.3405662e-7,1.3405662e-7,-1.8020741,12.077143,-61.932051)'
					/>
					<circle
						style={{ opacity: 0 }}
						cx='-8.8504734'
						cy='-95.859474'
						r='6.0135441'
						transform='matrix(-1.8020741,-1.3405662e-7,1.3405662e-7,-1.8020741,12.077143,-61.932051)'
					/>
				</g>
			</motion.g>
			<motion.g // inkscape:label='antenna-left'
				animate={{
					rotate: 5,
				}}
				transition={{
					repeat: Infinity,
					duration: 3,
					repeatType: 'mirror',
					type: 'tween',
				}}
			>
				<g
					style={{
						transform: 'matrix(0.44691441,0.32893683,-0.32893683,0.44691441,44.754705,2.6846332)',
					}}
				>
					<rect
						style={{ fill: '#ffc747' }}
						width='10.650013'
						height='43.970207'
						x='64.740845'
						y='27.046227'
					/>
					<circle
						style={{
							fill: '#ffc747',
							stroke: 'var(--background)',
							strokeWidth: 10,
							paintOrder: 'stroke fill markers',
						}}
						cx='70.065849'
						cy='27.046227'
						r='7.9096565'
					/>
					<rect
						style={{ opacity: 0 }}
						width='5.9098639'
						height='24.399778'
						x='-79.471199'
						y='-39.440891'
						transform='matrix(-1.8020741,-5.3296031e-8,5.3296031e-8,-1.8020741,-67.822124,43.911229)'
					/>
					<circle
						style={{ opacity: 0 }}
						cx='-76.516273'
						cy='-39.440891'
						r='4.3891959'
						transform='matrix(-1.8020741,-5.3296031e-8,5.3296031e-8,-1.8020741,-67.822124,43.911229)'
					/>
				</g>
			</motion.g>
			<motion.g // inkscape:label='body'
				ref={ svgRef }
			>
				<g
					transform='matrix(0.55491613,0,0,0.55491613,22.254193,23.89466)'
				>
					<rect
						style={{ fill: 'var(--background)' }}
						width='70.639999'
						height='52.095608'
						x='14.680054'
						y='45'
						ry='0'
					/>
					<rect
						style={{ fill: '#ffc747' }}
						width='70.639893'
						height='42.095608'
						x='14.680054'
						y='50'
						ry='7.473691'
					/>
				</g>
			</motion.g>
			<motion.g // inkscape:label='eye-right'
				animate={{
					x: mouseXDelta,
					y: mouseYDelta,
				}}
			>	
				<circle
					style={{ fill: 'var(--background)' }}
					cx={ 41.884613 }
					cy={ 62.300571 }
					r={ 6.0135441 }
				/>
				<g // inkscape:label='eye-right'
					clipPath={ `url(#clipPath19-${id})` }
				>
					<motion.rect // inkscape:label='lid-top'
						animate={{
							y: `${blinkDelta * -50}%`,
						}}
						style={{ fill: '#ffc747' }}
						width='16.030249'
						height='12.027092'
						x='33.869488'
						y='68.314117'
					/>
					<circle // inkscape:label='circle-bottom'
						style={{ fill: '#ffc747' }}
						cx='41.884613'
						cy='74.32766'
						r='6.0135441'
					/>
					<motion.rect // inkscape:label='lid-bottom'
						animate={{
							y: `${blinkDelta * 50}%`,
						}}
						style={{ fill: '#ffc747' }}
						width='16.030249'
						height='12.027092'
						x='33.869488'
						y='44.259933'
					/>
				</g>
			</motion.g>
			<motion.g // inkscape:label='eye-left'
				animate={{
					x: mouseXDelta * 0.68,
					y: mouseYDelta * 0.68,
				}}
			>	
				<circle
					style={{ fill: 'var(--background)' }}
					cx={ 58.197456 }
					cy={ 65.376465 }
					r={ 4.3891959 }
				/>
				<g // inkscape:label='eye-left'
					clipPath={ `url(#clipPath21-${id})` }
				>
					<motion.rect // inkscape:label='lid-bottom'
						animate={{
							y: `${blinkDelta * -50}%`,
						}}
						style={{ fill: '#ffc747' }}
						width='11.648355'
						height='8.7783918'
						x='52.37328'
						y='69.765663'
					/>
					<circle // inkscape:label='circle-bottom'
						style={{ fill: '#ffc747' }}
						cx='58.197456'
						cy='74.154861'
						r='4.3891959'
					/>
					<motion.rect // inkscape:label='lid-top'
						animate={{
							y: `${blinkDelta * 50}%`,
						}}
						style={{ fill: '#ffc747' }}
						width='11.648355'
						height='8.7783918'
						x='52.37328'
						y='52.208874'
					/>
				</g>
			</motion.g>
			<motion.g // inkscape:label='thinking'
			>	
				<g // inkscape:label='thinking'
					style={{ display: 'none' }}
				>
					<circle // inkscape:label='circle-bottom'
						style={{ fill: '#ffffff' }}
						cx='26.249496'
						cy='56.516151'
						r='1.9600424'
					/>
					<circle // inkscape:label='circle-middle'
						style={{ fill: '#ffffff' }}
						cx='19.990448'
						cy='52.574696'
						r='3.4076118'
					/>
					<ellipse // inkscape:label='circle-top'
						style={{ fill: '#ffffff' }}
						cx='12.832587'
						cy='42.135117'
						rx='9.0253992'
						ry='6.5669851'
					/>
				</g>
			</motion.g>
			<motion.g // inkscape:label='magnifying-glass'
			>	
				<g // inkscape:label='magnifying-glass'
					style={{ display: 'none' }}
					transform='rotate(-32.915266,18.575314,62.54366)'
				>
					<path
						style={{ fill: '#ffffff' }}
						d='m 21.094836,67.908516 a 5.2406583,5.2406583 0 0 0 -5.240507,5.240507 5.2406583,5.2406583 0 0 0 5.240507,5.240507 5.2406583,5.2406583 0 0 0 5.240507,-5.240507 5.2406583,5.2406583 0 0 0 -5.240507,-5.240507 z m 0,2.468584 a 2.7720928,2.7720928 0 0 1 2.771924,2.771923 2.7720928,2.7720928 0 0 1 -2.771924,2.771924 2.7720928,2.7720928 0 0 1 -2.771923,-2.771924 2.7720928,2.7720928 0 0 1 2.771923,-2.771923 z'
					/>
					<rect
						style={{ fill: '#ffffff' }}
						width='2.4349046'
						height='7.1496086'
						x='19.877384'
						y='79.523041'
						ry='1.2174523'
					/>
				</g>
			</motion.g>
		</svg>
	);
}
