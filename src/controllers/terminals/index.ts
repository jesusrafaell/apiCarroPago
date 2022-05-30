// modules
import { NextFunction, Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import Comercios from '../../db/models/Comercios';
import { CreateTermianls } from '../../interfaces/createTerminals';

export const createTerminals = async (req: Request<any>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const dataCreateTerminals: CreateTermianls = req.body;
		const { comerRif, comerCantPost } = dataCreateTerminals;
		if (!comerRif || !comerCantPost) {
			throw { message: 'Necesita ingresar el rif del comercio y el numero de terminales' };
		}

		let msg = '';

		//Format for CarroPago

		const commerce = await getRepository(Comercios).findOne({
			where: { comerRif },
		});

		if (!commerce) throw { message: 'El comercio no existe' };
		const terminals = await getConnection().query(
			`EXEC SP_new_terminal 
			@Cant_Term = ${comerCantPost},
			@Afiliado = '720004108',
			@NombreComercio = '${commerce.comerDesc}',
			@Proveedor = 6,
			@TipoPos = 'IWL250 GPRS',
			@Modo = 'Comercio',
			@TecladoAbierto = 0,
			@Observaciones = '${commerce.comerObservaciones ? commerce.comerObservaciones : ''}',
			@UsuarioResponsable = 'API'`
		);

		const formatTerminals = (terminals: any[]) => {
			let list: any[] = [];
			for (let i = 0; i < terminals.length; i++) {
				list.push(terminals[i].id);
			}
			return list;
		};

		const nroTerminals = formatTerminals(terminals);

		res.status(200).json({ message: 'Terminales creadas', terminals: nroTerminals });
	} catch (err) {
		res.status(400).json(err);
	}
};
