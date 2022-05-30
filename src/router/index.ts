import { Application } from 'express';
import { TreeRepositoryNotSupportedError } from 'typeorm';

// routes
import auth from './auth';
import commerce from './commerce';
import terminals from './terminals';

export default (app: Application) => {
	auth(app);
	commerce(app);
	terminals(app);
};
