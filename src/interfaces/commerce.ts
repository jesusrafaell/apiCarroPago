export interface DataCommerce {
	commerce: {
		idActivityXAfiliado: string;
		comerDesc: string;
		comerTipoPer: string;
		comerCodigoBanco: string;
		comerCuentaBanco: string;
		comerRif: string;
		comerCodTipoCont: string;
		comerTipoPos: string;
		comerObservaciones: string;
		comerCodAliado: string;
		comerPuntoAdicional: number;
		comerCodigoBanco2: string;
		comerCuentaBanco2: string;
		comerCodigoBanco3: string;
		comerCuentaBanco3: string;
		locationCommerce: {
			estado: string;
			municipio: string;
			ciudad: string;
			parroquia: string;
			casa: string;
		};
		locationContact: {
			estado: string;
			municipio: string;
			ciudad: string;
			parroquia: string;
			casa: string;
		};
		locationPos: {
			estado: string;
			municipio: string;
			ciudad: string;
			parroquia: string;
			casa: string;
		};
		daysOperacion: {
			Lun: boolean;
			Mar: boolean;
			Mie: boolean;
			Jue: boolean;
			Vie: boolean;
			Sab: boolean;
			Dom: boolean;
		};
	};
	contacto: {
		contCodUsuario: null;
		contNombres: string;
		contApellidos: string;
		contTelefLoc: string;
		contTelefMov: string;
		contMail: string;
		contFreg: null;
	};
}

export interface LocationData {
	estado: string;
	municipio: string;
	ciudad: string;
	parroquia: string;
}
