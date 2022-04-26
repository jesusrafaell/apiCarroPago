import { Router } from 'express';
import { createCommerce } from '../../../controllers/commerce';

const Commerce: Router = Router();

Commerce.route('/create').post(createCommerce);

export default Commerce;
