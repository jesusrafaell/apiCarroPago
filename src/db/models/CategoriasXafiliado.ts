import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CategoriasXafiliado', { synchronize: false })
export default class CategoriasXafiliado {
	@PrimaryGeneratedColumn()
	catCodAfi!: number;

	@PrimaryGeneratedColumn()
	catCodCat!: number;
}
