// modules
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { getRepository } from 'typeorm';
import { Api } from '../../interfaces';
import Comercios from '../../db/models/Comercios';
import Contactos from '../../db/models/Contactos';
import ComerciosXafiliado from '../../db/models/ComerciosXafliado';

import { DateTime } from 'luxon';
import { DataCommerce, LocationData } from '../../interfaces/commerce';

//'import Users from '../../db/models/users';
//import Afiliado from '../../db/models/afiliado';
//import Commerce from '../../db/models/commerce';

export const daysToString = (value: any) => {
	let text: string = '';
	for (const item of Object.entries(value)) {
		if (item[1]) {
			text = text + (text.length ? ',' : '') + item[0].slice(0, 3);
		}
	}
	return text;
};

export const locationToString = (value: LocationData) => {
	let text: string = '';
	for (const item of Object.entries(value)) {
		if (item[1]) {
			text = text + (text.length ? ', ' : '') + item[1];
		}
	}
	return text;
};

export const createCommerce = async (req: Request<any>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const dataCommerce: DataCommerce = req.body;
		const { commerce, contacto } = dataCommerce;
		//data body
		if (!dataCommerce) throw { message: 'No existe comercio Para registrar', code: 400 };
		//const { id_commerce, id_client, bank_account_num, id_product, pos, number_post }: any = fmData;

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
		} else {
			console.log('Comercio ', commerce.comerRif, ' ya existe');
		}

		console.log(comercioSave);

		//Contacto
		const newContacto: any = {
			contCodComer: comercioSave!.comerCod,
			contNombres: contacto.contNombres,
			contApellidos: contacto.contApellidos,
			contTelefLoc: contacto.contTelefLoc,
			contTelefMov: contacto.contTelefLoc,
			contMail: contacto.contMail,
			contCodUsuario: '',
			contFreg: '',
		};

		let contactoSave = await getRepository(Contactos).findOne({
			where: { contCodComer: comercioSave!.comerCod, contMail: contacto.contMail },
		});

		if (!contactoSave) {
			contactoSave = await getRepository(Comercios).save(newContacto);
		} else {
			console.log('Contacto ', contacto.contMail, ' ya existe');
		}

		console.log(contactoSave);

		const cxaCodAfi = `${commerce.idActivityXAfiliado}`.split('');
		while (cxaCodAfi.length < 15) cxaCodAfi.unshift('0');
		const cxaCod: string = cxaCodAfi.join('');

		console.log('bug1', cxaCodAfi.join(''));

		let comerXafiSave = await getRepository(ComerciosXafiliado).findOne({
			where: { cxaCodComer: comercioSave!.comerCod },
		});

		console.log('bug2', comerXafiSave);

		if (!comerXafiSave) {
			comerXafiSave = await getRepository(ComerciosXafiliado).save({
				cxaCodAfi: cxaCod,
				cxaCodComer: comercioSave!.comerCod,
			});
		} else {
			console.log('ComercioXafiliado ', contacto.contMail, ' ya existe');
		}

		console.log(comerXafiSave);

		res.status(200).json({ message: 'comercio creado' });
	} catch (err) {
		next(err);
	}
};
