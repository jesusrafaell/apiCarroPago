import { Application } from 'express';
import Commerce from './commerceCarroPago/commerce.routes';

export default (app: Application) => {
	app.use('/commerce', Commerce);
};
