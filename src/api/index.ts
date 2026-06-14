import {
	Elysia,
} from 'elysia';

const api = new Elysia({ prefix: '/api' })
	.get('/', { message: 'Something over here!' })
	.get('/user', { name: 'Pablo', lastname: 'Contreras' })
	.get('/time', () => ({ timestamp: Date.now(), time: new Date() }))
	.get('/password', { error: 'Wrong password.' });

export default api;
