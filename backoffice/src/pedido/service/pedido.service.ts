import { Injectable } from '@nestjs/common';
import { Pedido } from '../entities/pedido.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class PedidoService {
    constructor(
        @InjectRepository(Pedido)
        private pedidoRepository: Repository<Pedido>,
        private appService: AppService
    ) { }

    async getPedidos(): Promise<Pedido[]> {
        return this.pedidoRepository.find();
    }

    async getPedidoById(id: number) {
        return this.pedidoRepository.findOne({ where: { id } });
    }

    async createPedido(pedidoData: Partial<Pedido>): Promise<Pedido | string> {

        const cliente = this.pedidoRepository.create(pedidoData);
        await this.pedidoRepository.save(cliente);

        return this.appService.message("sucesso", 201, "Cliente criado com sucesso");
    }

    async updatePedido(id: number, pedidoData: Partial<Pedido>): Promise<any> {
        const pedido = await this.getPedidoById(id);

        if (!pedido) {
            return this.appService.message("erro", 404, "Pedido não encontrado");
        }

        await this.pedidoRepository.update(id, pedidoData);
        await this.getPedidoById(id);

        return this.appService.message("sucesso", 200, "Pedido atualizado com sucesso");
    }

    async deletePedido(id: number): Promise<any> {
        const pedido = await this.getPedidoById(id);

        if (!pedido) {
            return this.appService.message("erro", 404, "Pedido não encontrado");
        }

        await this.pedidoRepository.delete(id);
        return this.appService.message("sucesso", 200, "Pedido deletado com sucesso");
    }
}
