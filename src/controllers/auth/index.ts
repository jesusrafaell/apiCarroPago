// modules
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import createToken from '../../utils/createToken';

import { getRepository } from 'typeorm';
//'import Users from '../../db/models/users';
//import Afiliado from '../../db/models/afiliado';
//import Commerce from '../../db/models/commerce';

export const login = async (req: Request<any>, res: Response<any>, next: NextFunction): Promise<void> => {
	/*
	const { email } = req.body;
	try {
		const user = await getRepository(Users).findOne({
			where: { email },
			relations: ['id_afiliado', 'id_afiliado.id_commerce', 'id_afiliado.id_commerce.id_ident_type'],
		});

		if (!user) throw { message: 'Correo o Contraseña incorrecta', code: 400 };

		const { password, id, id_afiliado, ...dataUser } = user;
		const aux: any = user;

		const validPassword = await bcrypt.compare(req.body.password, password);
		if (!validPassword) throw { message: 'Correo o Contraseña incorrecta', code: 400 };

		if (!validPassword) throw { message: 'No es un cliente de Tranred', code: 400 };

		const afiliado: any = id_afiliado;

		const typeRif = afiliado?.id_commerce?.id_ident_type?.name;
		const numRif = afiliado?.id_commerce?.ident_num;

		const resUser = {
			email: dataUser.email,
			identType: afiliado.id_commerce.id_ident_type.name,
			identNum: afiliado.id_commerce.ident_num,
			numAfiliado: afiliado.numA,
			rif: `${typeRif}${Number(numRif)}`,
			nameCommerce: afiliado.id_commerce.name,
		};

		const token: string = createToken(id!);

		res.status(200).json({ user: resUser, token: token, code: 200 });
	} catch (err) {
		res.status(400).json(err);
		//next(err)
	}
	*/
};
