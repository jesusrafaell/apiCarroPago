import { Router } from 'express';
import { login } from '../../../controllers/auth';
//import { RegisterData, LoginData, PassMailData, RegisterData1, RegisterData2 } from '../../Middlewares/data/auth';

const Auth: Router = Router();

// controllers

// ? Auth
Auth.route('/login').post(login);

export default Auth;
