import { createTerminals } from '../../controllers/terminals';
import { Router } from 'express';

const Terminals: Router = Router();

Terminals.route('/create').post(createTerminals);

export default Terminals;
