import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//const { HOST, PORT_PROVIDERS } = dotenv;

const dot = dotenv.config();

const createToken = (id: number): string => {
	//const { SECRET } = dot;
	const token: string = jwt.sign({ id: id }, process.env.SECRET!, { expiresIn: '3h' });
	return token;
};

export default createToken;
