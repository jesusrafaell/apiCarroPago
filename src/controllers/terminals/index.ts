// modules
import saveLogs from '../logs';
import { NextFunction, Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import Comercios from '../../db/models/Comercios';
import { CreateTermianls } from '../../interfaces/createTerminals';
import { createAbono } from '../commerce/abono';
import ComerciosXafiliado from '../../db/models/ComerciosXafliado';
import { formatTerminals } from '../../utils/formatTerminals';
import Abonos from '../../db/models/Abonos';

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

		const comerXafi = await getRepository(ComerciosXafiliado).findOne({
			where: { cxaCodComer: commerce.comerCod },
		});

		if (!comerXafi) throw { message: 'El comercio no tiene un numero de afiliado' };

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

		const nroTerminals = formatTerminals(terminals);

		const resAbono = await createAbono(nroTerminals, commerce!, comerXafi.cxaCodAfi);
		if (!resAbono.ok) {
			throw { message: 'Error al crear los abonos' };
		}

		const { id: userId }: any = req.headers.token;
		await saveLogs(
			userId,
			'POST',
			'/terminal/create',
			`[Comercio: ${comerRif}] [Nro_Terminales: ${comerCantPost}]`
		);

		res.status(200).json({ message: 'Terminales creadas', terminals: nroTerminals });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};

export const getTerminalsXcommercio = async (
	req: Request<any>,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { comerRif } = req.params;
		if (!comerRif) {
			throw { message: 'Necesita ingresar el rif del comercio' };
		}

		//Format for CarroPago

		const commerce = await getRepository(Comercios).findOne({
			where: { comerRif },
		});

		if (!commerce) throw { message: 'El comercio no existe' };

		const terminales = await getRepository(Abonos).find({
			where: { aboCodComercio: commerce.comerCod },
		});

		if (!terminales.length) throw { message: 'El comercio no tiene terminales' };

		const formatTerminalsFromAbono = (terminals: Abonos[]): string => {
			let list: string = '';
			for (let i = 0; i < terminals.length; i++) {
				list += terminals[i].aboTerminal + (i < terminals.length - 1 ? ',' : '');
			}
			return list;
		};

		const terminalsXCommerce: string = formatTerminalsFromAbono(terminales);

		/*
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
		*/

		const { id: userId }: any = req.headers.token;
		await saveLogs(userId, 'GET', '/terminals/commerce', `[Comercio: ${comerRif}]`);

		res.status(200).json({ message: `Terminales del comercio: ${comerRif}`, terminals: terminalsXCommerce });
	} catch (err) {
		console.log(err);
		res.status(400).json(err);
	}
};
