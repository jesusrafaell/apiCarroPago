import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import orign_logs_carropago from './origin_logs_carropago';
import Usuarios from './Usuarios';

@Entity({ synchronize: true })
export default class general_logs_carropago {
	@PrimaryGeneratedColumn()
	id?: number;

	@ManyToOne(() => Usuarios, (Usuarios) => Usuarios.general_logs_carropago)
	@JoinColumn({ name: 'id_user' })
	id_user!: number;

	@Column()
	descript!: string;

	@ManyToOne(() => orign_logs_carropago, (orign_logs_carropago) => orign_logs_carropago.general_logs_carropago)
	@JoinColumn({ name: 'id_origin_logs_carropago' })
	id_origin_logs_carropago!: number;

	@CreateDateColumn()
	createdAt?: Date;
}
