import { Application } from 'express';
import Auth from './auth/auth.routes';

export default (app: Application) => {
	app.use('/auth', Auth);
};
