// app's
//import services from './services';
import { createConnection, getRepository } from 'typeorm';
import express, { Application, Request, Response } from 'express';
import Routes from './router';
import cors from './Middlewares/secure';
import { preRoutes } from './Middlewares';

createConnection()
	.then(async () => {
		const app = express();

		app.use(express.json());

		app.use(cors);

		//Rutas con token
		//preRoutes(app);

		//Routes
		Routes(app);

		const port = 8081;
		app.set('port', port);

		app.listen(app.get('port'), () => {
			console.log('');
			console.log('╔═╗┌─┐┬  ╔═╗┌─┐┬─┐┬─┐┌─┐┌─┐┌─┐┌─┐┌─┐');
			console.log('╠═╣├─┘│  ║  ├─┤├┬┘├┬┘│ │├─┘├─┤│ ┬│ │');
			console.log('╩ ╩┴  ┴  ╚═╝┴ ┴┴└─┴└─└─┘┴  ┴ ┴└─┘└─┘');
			console.log('');
			console.log('ON Port', port);
			console.log('');
		});
	})
	.catch((err) => console.log('DB ERR', err));
