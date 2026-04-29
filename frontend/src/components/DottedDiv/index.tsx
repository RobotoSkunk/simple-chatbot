
import _style from './dotted.module.css';

// Inspired from https://dotted.framer.website

export default function DottedDiv({
	color,
	dotSize,
	dotGap,
	blurSize,
	gradientRotation,
	gradientSize,

	children,

	style,
	className,
}: {
	color: string;
	dotSize?: number;
	dotGap?: number;
	blurSize?: number;
	gradientRotation?: number;
	gradientSize?: number;

	children?: React.ReactNode,

	className?: string;
	style?: Omit<React.CSSProperties,
		'backdropFilter' |
		'backgroundColor' |
		'backgroundImage' |
		'backgroundSize' |
		'maskImage'
	>;
})
{
	return (
		<div
			className={ [ _style.dotted, className ].join(' ') }
			style={{
				backdropFilter: `blur(${ blurSize ?? 5 }px)`,
				backgroundImage: `radial-gradient(transparent ${ dotSize ?? 1 }px, ${ color } ${ dotSize ?? 1 }px)`,
				backgroundSize: `${ dotGap ?? 4 }px ${ dotGap ?? 4 }px`,
				maskImage: `linear-gradient(${ gradientRotation ?? 0 }deg, black calc(100% - ${ gradientSize ?? 10 }px), transparent)`,

				...style,
			}}
		>
			{ children }
		</div>
	);
}
