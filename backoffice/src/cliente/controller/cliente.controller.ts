import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ClienteService } from '../service/cliente.service';
import { Cliente } from '../entities/cliente.entity';

@Controller('cliente')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService) { }

    @Get()
    getClientes(): Promise<Cliente[]> {
        return this.clienteService.getClientes();
    }

    @Get(':id')
    getClienteById(@Param('id') id: number): Promise<Cliente | null> {
        return this.clienteService.getClienteById(id);
    }

    @Post('cadastrar')
    postCliente(@Body() body: Partial<Cliente>): any {
        return this.clienteService.createCliente(body);
    }

    @Put('alterar/:id')
    updateCliente(@Param('id') id: number, @Body() body: Partial<Cliente>): Promise<Cliente | null> {
        return this.clienteService.updateCliente(id, body);
    }

    @Delete('deletar/:id')
    deleteCliente(@Param('id') id: number): Promise<void> {
        return this.clienteService.deleteCliente(id);
    }
}
