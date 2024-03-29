import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import general_logs_carropago from './general_logs_carropago';

@Entity({ synchronize: false })
export default class Usuarios {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ nullable: false })
	login!: string;

	@Column({ nullable: false })
	contrasena!: string;

	@Column({ nullable: false })
	nombre!: string;

	@Column({ nullable: false })
	tipoIdentificacion!: string;

	@Column({ nullable: false })
	identificacion!: string;

	@Column({ nullable: false })
	email!: string;

	@Column({ nullable: false })
	perfilId!: number;

	@Column({ nullable: false })
	fechaCreacion!: Date;

	@Column({ nullable: false })
	fechaExpira!: Date;

	@Column({ nullable: false })
	ultimoAcceso!: Date;

	@Column({ nullable: false })
	estatus!: number;

	@OneToMany(() => general_logs_carropago, (general_logs_carropago) => general_logs_carropago.id_user)
	@JoinColumn({ name: 'general_logs_carropago' })
	general_logs_carropago?: general_logs_carropago[];
}
