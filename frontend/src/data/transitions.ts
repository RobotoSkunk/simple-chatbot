
import type {
	Transition,
} from 'framer-motion';

const smooth = {
	type: 'spring',
	stiffness: 300,
	damping: 30,
} satisfies Transition;

export {
	smooth,
};
