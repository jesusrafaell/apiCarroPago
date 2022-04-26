import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ synchronize: false })
export default class ComerciosXafiliado {
	@Column({ nullable: true })
	cxaCodAfi!: string;

	@Column({ nullable: true })
	cxaCodComer!: number;

	@PrimaryGeneratedColumn()
	cxaId!: number;
}
