import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './../entities/cliente.entity';
import { AppService } from './../../app.service';

@Injectable()
export class ClienteService {
    constructor(
        @InjectRepository(Cliente)
        private clienteRepository: Repository<Cliente>,
        private appService: AppService
    ) { }

    async createCliente(clienteData: Partial<Cliente>): Promise<Cliente | string> {
        const cnpj = clienteData.cnpj;
        const email = clienteData.email;

        if (!cnpj) {
            return this.appService.message("error", 400, 'O campo CNPJ é obrigatório.');
        }

        if (!email) {
            return this.appService.message("error", 400, 'O campo EMAIL é obrigatório.');
        }

        const existingCliente = await this.clienteRepository.findOne({
            where: [
                { cnpj },
                { email },
            ],
        });

        if (existingCliente) {
            if (existingCliente.cnpj === cnpj) {
                return this.appService.message("error", 409, "CNPJ já cadastrado na base de dados");
            }
            if (existingCliente.email === email) {
                return this.appService.message("error", 409, "EMAIL já cadastrado na base de dados");
            }
        }

        const cliente = this.clienteRepository.create(clienteData);
        await this.clienteRepository.save(cliente);

        return this.appService.message("sucesso", 201, "Cliente criado com sucesso");
    }

    async getClientes(): Promise<Cliente[]> {
        return this.clienteRepository.find();
    }

    async getClienteById(id: number): Promise<Cliente | null> {
        return this.clienteRepository.findOne({ where: { id } });
    }

    async updateCliente(id: number, clienteData: Partial<Cliente>): Promise<any> {
        const cliente = await this.getClienteById(id);

        if (!cliente) {
            return this.appService.message("erro", 404, "Cliente não encontrado");
        }

        await this.clienteRepository.update(id, clienteData);
        await this.getClienteById(id);

        return this.appService.message("sucesso", 200, "Cliente atualizado com sucesso");
    }

    async deleteCliente(id: number): Promise<any> {
        const cliente = await this.getClienteById(id);

        if (!cliente) {
            return this.appService.message("erro", 404, "Cliente não encontrado");
        }

        await this.clienteRepository.delete(id);
        return this.appService.message("sucesso", 200, "Cliente deletado com sucesso");
    }
}
