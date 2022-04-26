import cors, { CorsOptions, CorsRequest } from 'cors';

const origin = (origin?: string, cb?: any) => cb(null, true);

/** Cors Option */
const corsOptions: CorsOptions = {
	methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
	origin,
};

export default cors(corsOptions);
