// modules
import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';
import { getConnection, getRepository } from 'typeorm';
import Comercios from '../../db/models/Comercios';
import Contactos from '../../db/models/Contactos';
import { DataCommerce } from '../../interfaces/commerce';
import ComerciosXafiliado from '../../db/models/ComerciosXafliado';
import ComisionesMilPagos from '../../db/models/ComisionesMilPagos';
import { daysToString, locationToString } from '../../utils/formatString';
import saveLogs from '../logs';
import CategoriasXafiliado from '../../db/models/CategoriasXafiliado';
import Afiliados from '../../db/models/Afiliados';

export const createCommerce = async (req: Request<any>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const dataCommerce: DataCommerce = req.body;
		const { commerce, contacto } = dataCommerce;

		let msg = '';

		if (!dataCommerce.commerce || !dataCommerce.contacto)
			throw { message: 'No existe comercio Para registrar', code: 400 };

		const numeros = '0123456789';
		if (numeros.indexOf(commerce.comerRif[0]) != -1) {
			throw { message: 'El rif del comercio es invalido (Debe comenzar con una letra)' };
		}

		if (commerce.comerRif.length > 10) throw { message: 'El rif del comercio es invalido (Muy largo)' };

		const cxaCodAfi = `${commerce.idActivityXAfiliado}`.split('');
		while (cxaCodAfi.length < 15) cxaCodAfi.unshift('0');
		const cxaCod: string = cxaCodAfi.join('');

		const afiliado: Afiliados | undefined = await getRepository(Afiliados).findOne(cxaCod);

		if (!afiliado) throw { message: `No existe el numero de afiliado: ${cxaCod}` };

		if (Number(commerce.idActivityXAfiliado) !== 720008177) {
			throw { message: 'No puedes crear comercio con ese afiliado' };
		}

		const categoria: CategoriasXafiliado | undefined = await getRepository(CategoriasXafiliado).findOne({
			where: {
				catCodAfi: afiliado.afiCod,
			},
		});

		console.log('afiliado:', afiliado.afiCod, '/ caterogia:', categoria?.catCodCat);

		if (!categoria) throw { message: 'No existe categoria de ese afiliado' };

		//Format for CarroPago
		const newCommerce: any = {
			comerDesc: commerce.comerDesc,
			comerTipoPer: Number(commerce.comerTipoPer),
			comerCodigoBanco: commerce.comerCodigoBanco,
			comerCuentaBanco: commerce.comerCuentaBanco,
			comerPagaIva: 'SI',
			comerCodUsuario: null,
			comerCodPadre: 0,
			comerRif: commerce.comerRif,
			comerFreg: null,
			comerCodTipoCont: Number(commerce.comerCodTipoCont),
			comerInicioContrato: DateTime.local().toISODate(),
			comerFinContrato: DateTime.local().plus({ years: 1 }).toISODate(),
			comerExcluirPago: 0,
			comerCodCategoria: categoria.catCodCat,
			comerGarantiaFianza: 1,
			comerModalidadGarantia: 1,
			comerMontoGarFian: 7.77,
			comerModalidadPos: 3,
			comerTipoPos: Number(commerce.comerTipoPos),
			comerRecaudos: null,
			comerDireccion: locationToString(commerce.locationCommerce),
			comerObservaciones: commerce.comerObservaciones,
			comerCodAliado: 84,
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

		let comercioSave: Comercios | undefined = await getRepository(Comercios).findOne({
			where: { comerRif: commerce.comerRif },
		});

		if (!comercioSave) {
			comercioSave = await getRepository(Comercios).save(newCommerce);

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

			//Crear comerxafiliado
			let comerXafiSave = await getRepository(ComerciosXafiliado).findOne({
				where: { cxaCodComer: comercioSave!.comerCod },
			});

			if (!comerXafiSave) {
				comerXafiSave = await getRepository(ComerciosXafiliado).save({
					cxaCodAfi: cxaCod,
					cxaCodComer: comercioSave!.comerCod,
				});
			} else {
				console.log('ComercioXafiliado ya existe', comercioSave?.comerCod);
			}

			//Crear Comision
			let comisionSave = await getRepository(ComisionesMilPagos).findOne({
				where: { cmCodComercio: comercioSave!.comerCod },
			});

			if (!comisionSave) {
				await getConnection().query(
					`
						INSERT INTO [dbo].[ComisionesMilPagos]
							([cmCodComercio] ,[cmPorcentaje])
						VALUES (${comercioSave?.comerCod} ,0)				
					`
				);
				/*
				comisionSave = await getRepository(ComisionesMilPagos).save({
					cmCodComercio: comercioSave!.comerCod,
					cmPorcentaje: 0,
				});
				*/
			} else {
				console.log('Comision ya existe', comercioSave?.comerCod);
			}

			//
			msg = 'creado exitosamente';
		} else {
			throw {
				message: `Comercio ${commerce.comerRif} ya se encuentra registrado`,
			};
		}

		const { id: userId }: any = req.headers.token;
		await saveLogs(userId, 'POST', '/commerce/create', `[Comercio: ${commerce.comerRif}]`);

		res.status(200).json({ message: `Comercio ${commerce.comerRif} ${msg}` });
	} catch (err: any) {
		console.log(err);
		if (err.message) {
			res.status(400).json(err);
		} else res.status(400).json('Error en la Base de Datos');
	}
};
