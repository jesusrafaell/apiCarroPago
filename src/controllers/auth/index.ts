// modules
import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createToken from '../../utils/createToken';

import process from 'child_process';
import Usuarios from '../../db/models/Usuarios';

function execCommand(cmd: string, password: string) {
	return new Promise((resolve, reject) => {
		process.exec(cmd, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
			}
			resolve(stdout ? stdout : stderr);
		});
	});
}

interface User {
	username: string;
	pass: string;
}

export const login = async (req: Request<any>, res: Response<any>, next: NextFunction): Promise<void> => {
	try {
		const { username, pass }: User = req.body;

		if (!req.body || !username || !pass) throw { message: 'Se necesita login', code: 400 };
		const encriptPass = await execCommand(`java -jar java.encript/java.jar ${pass}`, pass);

		const user = await getRepository(Usuarios).findOne({
			where: {
				login: username,
				contrasena: encriptPass,
			},
		});

		if (!user) throw { message: 'Usuario: acceso denegado', code: 400 };

		if (user.perfilId !== 23) {
			//No puede crear comercio por la api
			throw { message: 'Este Usuario no tiene acceso a la API', code: 400 };
		}

		const token: string = createToken(user.id);
		res.status(200).json({ access_token: token });
	} catch (err) {
		res.status(400).json(err);
	}
};
