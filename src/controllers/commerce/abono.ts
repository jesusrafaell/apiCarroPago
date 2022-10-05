import Abonos from '../../db/models/Abonos';
import { getRepository } from 'typeorm';
import Comercios from '../../db/models/Comercios';

export const createAbono = async (terminals: any[], commerce: Comercios, cxaCodAfi: string) => {
	try {
		//
		const abono = terminals.map((terminal: any) => ({
			aboTerminal: terminal,
			aboCodAfi: cxaCodAfi,
			aboCodComercio: commerce.comerCod,
			aboCodBanco: commerce.comerCodigoBanco,
			aboNroCuenta: commerce.comerCuentaBanco,
			aboTipoCuenta: '01',
			estatusId: 23,
		}));

		await getRepository(Abonos).save(abono);

		return {
			ok: true,
		};
	} catch (err) {
		console.log(err);
		return {
			ok: false,
			err,
		};
	}
};
