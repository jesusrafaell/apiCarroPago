import { getRepository } from 'typeorm';
import general_logs_carropago from '../../db/models/general_logs_carropago';

export default async function saveLogs(id: number, method: string, path: string, msg: string) {
	try {
		const log: general_logs_carropago = {
			id_user: id,
			descript: `[method:${method}]::[path:${path}]::[msg:${msg}]`,
			id_origin_logs_carropago: 1, //api carropago
		};

		await getRepository(general_logs_carropago).save(log);
		return;
	} catch (err) {
		return err;
	}
}
