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

    /**
     * Cria um novo cliente com os dados fornecidos.
     * @param {Partial<Cliente>} clienteData - Dados do cliente a serem criados.
     * @returns {Promise<Cliente | string>} Mensagem de sucesso ou erro.
     */
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

    /**
     * Obtém todos os clientes cadastrados.
     * @returns {Promise<Cliente[]>} Uma lista de clientes.
     */
    async getClientes(): Promise<Cliente[]> {
        return this.clienteRepository.find();
    }

    /**
     * Obtém um cliente específico pelo seu ID.
     * @param {number} id - O ID do cliente a ser buscado.
     * @returns {Promise<Cliente | null>} O cliente encontrado ou null se não existir.
     */
    async getClienteById(id: number): Promise<Cliente | null> {
        return this.clienteRepository.findOne({ where: { id } });
    }

    /**
     * Atualiza os dados de um cliente existente.
     * @param {number} id - O ID do cliente a ser atualizado.
     * @param {Partial<Cliente>} clienteData - Novos dados do cliente.
     * @returns {Promise<any>} Mensagem de sucesso ou erro.
     */
    async updateCliente(id: number, clienteData: Partial<Cliente>): Promise<any> {
        const cliente = await this.getClienteById(id);

        if (!cliente) {
            return this.appService.message("erro", 404, "Cliente não encontrado");
        }

        await this.clienteRepository.update(id, clienteData);
        await this.getClienteById(id);

        return this.appService.message("sucesso", 200, "Cliente atualizado com sucesso");
    }

    /**
     * Exclui um cliente pelo seu ID.
     * @param {number} id - O ID do cliente a ser excluído.
     * @returns {Promise<any>} Mensagem de sucesso ou erro.
     */
    async deleteCliente(id: number): Promise<any> {
        const cliente = await this.getClienteById(id);

        if (!cliente) {
            return this.appService.message("erro", 404, "Cliente não encontrado");
        }

        await this.clienteRepository.delete(id);
        return this.appService.message("sucesso", 200, "Cliente deletado com sucesso");
    }
}