import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { PedidoService } from '../service/pedido.service';
import { Pedido } from '../entities/pedido.entity';

@Controller('pedido')
export class PedidoController {

    constructor(
        private appService: AppService,
        private pedidoService: PedidoService
    ) { }

    @Get()
    getpedidos(): Promise<Pedido[]> {
        return this.pedidoService.getPedidos();
    }

    @Get(':id')
    getpedidoById(@Param('id') id: number): Promise<Pedido | null> {
        return this.pedidoService.getPedidoById(id);
    }

    @Post('cadastrar')
    postpedido(@Body() body: Partial<Pedido>): any {
        return this.pedidoService.createPedido(body);
    }

    @Put(':id')
    updatepedido(@Param('id') id: number, @Body() body: Partial<Pedido>): Promise<Pedido | null> {
        return this.pedidoService.updatePedido(id, body);
    }

    @Delete(':id')
    deletepedido(@Param('id') id: number): Promise<void> {
        return this.pedidoService.deletePedido(id);
    }
}
