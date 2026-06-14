import { Elysia } from 'elysia';

const authApp = new Elysia()
	.onBeforeHandle(() =>
	{
		console.log('Handled!');
	})
	.get('/something', () => new Response('Check the output!'));

const app = new Elysia()
	.use(authApp)
	.get('/', () => new Response('Hi there!'));

app.listen(8080, () =>
{
	console.log('Running!');
});
