import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { ItemPedido } from './items_pedido.entity';

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cliente, { eager: true })
    @JoinColumn({ name: 'id_cliente' })
    cliente: Cliente;

    @Column({ default: 'pendente' })
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataCriado: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    dataAlterado: Date;

    @OneToMany(() => ItemPedido, (itemPedido) => itemPedido.id_pedido)
    itens: ItemPedido[];
}

