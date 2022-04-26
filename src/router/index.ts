import { Application } from 'express';
import { TreeRepositoryNotSupportedError } from 'typeorm';

// routes
import auth from './auth';
import commerce from './commerce';

export default (app: Application) => {
	//auth(app);
	commerce(app);
};
