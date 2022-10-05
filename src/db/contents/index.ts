import origin_logs_carropago from '../models/origin_logs_carropago';
import { createConnection, getRepository } from 'typeorm';

createConnection().then(async () => {
	const data: origin_logs_carropago = {
		name: 'CarroPago API',
	};
	const valid = await getRepository(origin_logs_carropago).find({ where: data });
	if (!valid.length) await getRepository(origin_logs_carropago).save(data);

	console.log('listo origin predata');
	return;
});
