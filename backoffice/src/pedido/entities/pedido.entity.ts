import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Produto } from '../../produto/entities/produto.entity';

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cliente, { eager: true })
    @JoinColumn({ name: 'idcliente' })
    cliente: Cliente;

    @ManyToOne(() => Produto, { eager: true })
    @JoinColumn({ name: 'idproduto' })
    produto: Produto;

    @Column()
    quantidade: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_desconto: number;

    @Column('decimal', { precision: 10, scale: 2 })
    valor_unitario: number;

    @Column({ default: 'pendente' })
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataCriado: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    dataAlterado: Date;
}
