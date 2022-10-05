import { Application } from 'express';
import Terminals from './terminals.routes';

export default (app: Application) => {
	app.use('/terminal', Terminals);
};
