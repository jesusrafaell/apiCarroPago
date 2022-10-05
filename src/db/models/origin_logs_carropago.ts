import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToMany } from 'typeorm';
import general_logs_carropago from './general_logs_carropago';

@Entity({ synchronize: true })
export default class origin_logs_carropago {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	name!: string;

	@OneToMany(
		() => general_logs_carropago,
		(general_logs_carropago) => general_logs_carropago.id_origin_logs_carropago
	)
	@JoinColumn({ name: 'general_logs_carropago' })
	general_logs_carropago?: general_logs_carropago[];
}
