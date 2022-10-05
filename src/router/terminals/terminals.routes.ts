import { createTerminals, getTerminalsXcommercio } from '../../controllers/terminals';
import { Router } from 'express';

const Terminals: Router = Router();

Terminals.route('/create').post(createTerminals);
//
Terminals.route('/commerce/:comerRif').get(getTerminalsXcommercio);

export default Terminals;
