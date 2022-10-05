import jwt from 'jsonwebtoken';
require('dotenv').config();

const createToken = (id: number): string => {
	//const { SECRET } = dot;
	const token: string = jwt.sign({ id: id }, process.env.SECRET!, { expiresIn: '4h' });
	return token;
};

export default createToken;
