import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProdutoImagem } from './produtoImagem.entity';

@Entity()
export class Produto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    descricao: string;

    @Column('decimal', { precision: 10, scale: 2 })
    valor: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    desconto: number;

    @Column()
    quantidade_estoque: number;

    @Column({ default: 'ativo' })
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataCriado: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    dataAlterado: Date;

    @OneToMany(() => ProdutoImagem, (produtoImagem) => produtoImagem.produto)
    imagens: ProdutoImagem[];
}
