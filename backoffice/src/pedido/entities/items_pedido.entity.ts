import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Produto } from '../../produto/entities/produto.entity';

@Entity()
export class ItemPedido {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Pedido, (pedido) => pedido.itens)
    @JoinColumn({ name: 'id_pedido' })
    id_pedido: Pedido;

    @ManyToOne(() => Produto, { eager: true })
    @JoinColumn({ name: 'id_produto' })
    id_produto: Produto;

    @Column()
    quantidade: number;

    @Column('decimal', { precision: 10, scale: 2 })
    valor_unitario: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total_desconto: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataCriado: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    dataAlterado: Date;
}

