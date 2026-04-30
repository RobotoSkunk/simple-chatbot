
'use client';

import { 
	createContext,
} from 'react';

export const ChatsContext = createContext<{
	data: ChatData[];
	update: (data: ChatData[]) => void;
}>({
	data: [],
	update: () => {},
});
