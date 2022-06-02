// modules
import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';
import { getConnection, getRepository } from 'typeorm';
import { formatTerminals } from '../../utils/formatTerminals';
import Comercios from '../../db/models/Comercios';
import ComerciosXafiliado from '../../db/models/ComerciosXafliado';
import Contactos from '../../db/models/Contactos';
import { DataCommerce } from '../../interfaces/commerce';
import { daysToString, locationToString } from '../../utils/formatString';
import saveLogs from '../logs';

export const createCommerce = async (req: Request<any>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const dataCommerce: DataCommerce = req.body;
		const { commerce, contacto } = dataCommerce;

		let msg = '';

		if (!dataCommerce.commerce || !dataCommerce.contacto)
			throw { message: 'No existe comercio Para registrar', code: 400 };

		//Format for CarroPago
		const newCommerce: any = {
			comerDesc: commerce.comerDesc,
			comerTipoPer: commerce.comerTipoPer,
			comerCodigoBanco: commerce.comerCodigoBanco,
			comerCuentaBanco: commerce.comerCuentaBanco,
			comerPagaIva: 'SI',
			comerCodUsuario: null,
			comerCodPadre: 0,
			comerRif: commerce.comerRif,
			comerFreg: null,
			comerCodTipoCont: commerce.comerCodTipoCont,
			comerInicioContrato: DateTime.local().toISODate(),
			comerFinContrato: DateTime.local().plus({ years: 1 }).toISODate(),
			comerExcluirPago: 0,
			comerCodCategoria: 5411,
			comerGarantiaFianza: 1,
			comerModalidadGarantia: 1,
			comerMontoGarFian: 7.77,
			comerModalidadPos: 3,
			comerTipoPos: commerce.comerTipoPos,
			comerRecaudos: null,
			comerDireccion: locationToString(commerce.locationCommerce),
			comerObservaciones: commerce.comerObservaciones,
			comerCodAliado: commerce.comerCodAliado,
			comerEstatus: 5,
			comerHorario: null,
			comerImagen: null,
			comerPuntoAdicional: commerce.comerPuntoAdicional,
			comerCodigoBanco2: commerce.comerCodigoBanco2,
			comerCuentaBanco2: commerce.comerCuentaBanco2,
			comerCodigoBanco3: commerce.comerCodigoBanco3,
			comerCuentaBanco3: commerce.comerCuentaBanco3,
			//
			comerDireccionHabitacion: locationToString(commerce.locationContact),
			comerDireccionPos: locationToString(commerce.locationPos),
			comerDiasOperacion: daysToString(commerce.daysOperacion),
			comerFechaGarFian: null,
		};

		let comercioSave = await getRepository(Comercios).findOne({
			where: { comerRif: commerce.comerRif },
		});

		if (!comercioSave) {
			comercioSave = await getRepository(Comercios).save(newCommerce);
			msg = 'creado';
		} else {
			msg = 'ya existe';
		}

		//Contacto
		const newContacto: any = {
			contCodComer: comercioSave!.comerCod,
			contNombres: contacto.contNombres,
			contApellidos: contacto.contApellidos,
			contTelefLoc: contacto.contTelefLoc,
			contTelefMov: contacto.contTelefLoc,
			contMail: contacto.contMail,
			contCodUsuario: null,
			contFreg: null,
		};

		await getRepository(Contactos).save(newContacto);

		const cxaCodAfi = `${commerce.idActivityXAfiliado}`.split('');
		while (cxaCodAfi.length < 15) cxaCodAfi.unshift('0');
		const cxaCod: string = cxaCodAfi.join('');

		let comerXafiSave = await getRepository(ComerciosXafiliado).findOne({
			where: { cxaCodComer: comercioSave!.comerCod },
		});

		if (!comerXafiSave) {
			comerXafiSave = await getRepository(ComerciosXafiliado).save({
				cxaCodAfi: cxaCod,
				cxaCodComer: comercioSave!.comerCod,
			});
		} else {
			console.log('ComercioXafiliado ', contacto.contMail, ' ya existe');
		}

		const { comerCantPost } = commerce;

		console.log(comerCantPost);
		//
		let nroTerminals: string[] = [];
		if (comerCantPost) {
			const terminals = await getConnection().query(
				`EXEC SP_new_terminal 
			@Cant_Term = ${comerCantPost || 1},
			@Afiliado = '720004108',
			@NombreComercio = '${newCommerce.comerDesc}',
			@Proveedor = 6,
			@TipoPos = 'IWL250 GPRS',
			@Modo = 'Comercio',
			@TecladoAbierto = 0,
			@Observaciones = '${newCommerce.comerObservaciones ? newCommerce.comerObservaciones : ''}',
			@UsuarioResponsable = 'API'`
			);
			nroTerminals = formatTerminals(terminals);
		}

		const { id: userId }: any = req.headers.token;
		await saveLogs(
			userId,
			'POST',
			'/commerce/create',
			`[Comercio: ${commerce.comerRif}][Nro_Terminales: ${comerCantPost}]`
		);

		res.status(200).json({ message: `Comercio ${commerce.comerRif} ${msg}`, terminals: nroTerminals });
	} catch (err) {
		res.status(400).json(err);
	}
};
