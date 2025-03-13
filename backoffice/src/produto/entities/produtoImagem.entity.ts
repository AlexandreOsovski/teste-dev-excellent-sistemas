import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Produto } from './produto.entity';

@Entity()
export class ProdutoImagem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @ManyToOne(() => Produto, (produto) => produto.imagens)
    @JoinColumn({ name: 'idproduto' })
    produto: Produto;

    @Column()
    idproduto: number;

}
