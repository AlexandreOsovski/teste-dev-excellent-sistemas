import { Injectable } from '@nestjs/common';
import { Pedido } from '../entities/pedido.entity';
import { ItemPedido } from '../entities/items_pedido.entity';
import { Produto } from '../../produto/entities/produto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from 'src/app.service';

@Injectable()
export class PedidoService {
    constructor(
        @InjectRepository(Pedido)
        private pedidoRepository: Repository<Pedido>,

        @InjectRepository(ItemPedido)
        private itemPedidoRepository: Repository<ItemPedido>,

        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,

        private appService: AppService
    ) { }

    /**
     * Obtém todos os pedidos cadastrados.
     * @returns {Promise<Pedido[]>} Uma lista de pedidos.
     */
    async getPedidos(): Promise<Pedido[]> {
        return this.pedidoRepository.find();
    }

    /**
     * Cria um novo pedido com os dados fornecidos e seus itens associados.
     * @param {Partial<Pedido>} pedidoData - Dados do pedido a serem criados.
     * @param {any[]} items - Lista de itens do pedido.
     * @returns {Promise<Pedido | string>} Mensagem de sucesso ou erro.
     */
    async createPedido(pedidoData: Partial<Pedido>, items: any[]): Promise<Pedido | string> {
        if (!items || items.length === 0) {
            return this.appService.message("erro", 400, "Nenhum item encontrado para o pedido");
        }

        const pedido = this.pedidoRepository.create(pedidoData);
        await this.pedidoRepository.save(pedido);

        const itemPedidos = items.map(item => {
            if (isNaN(item.quantidade) || isNaN(item.valorUnitario)) {
                return this.appService.message("erro", 400, "Quantidades e valores dos produtos precisam ser números válidos");
            }

            const itemPedido = new ItemPedido();
            itemPedido.id_pedido = pedido;
            itemPedido.id_produto = item.produtoId;
            itemPedido.quantidade = item.quantidade || 1;
            itemPedido.valor_unitario = item.valorUnitario;

            itemPedido.total = item.quantidade * item.valorUnitario;

            if (isNaN(itemPedido.total)) {
                return this.appService.message("erro", 400, "Erro no cálculo do total do item");
            }

            itemPedido.total_desconto = item.totalDesconto || 0;

            return itemPedido;
        });

        await this.itemPedidoRepository.save(itemPedidos);

        for (const item of items) {
            const produto = await this.produtoRepository.findOne({ where: { id: item.produtoId } });
            if (produto) {
                if (produto.quantidade_estoque < item.quantidade) {
                    return this.appService.message("erro", 400, `Estoque insuficiente para o produto ${produto.nome}`);
                }
                produto.quantidade_estoque -= item.quantidade;
                await this.produtoRepository.save(produto);
            }
        }

        return this.appService.message("sucesso", 201, "Pedido criado com sucesso");
    }

    /**
     * Atualiza os dados de um pedido existente.
     * @param {number} id - O ID do pedido a ser atualizado.
     * @param {Partial<Pedido>} pedidoData - Novos dados do pedido.
     * @returns {Promise<any>} Mensagem de sucesso ou erro.
     */
    async updatePedido(id: number, pedidoData: Partial<Pedido>): Promise<any> {
        const pedido = await this.getPedidoById(id);

        if (!pedido) {
            return this.appService.message("erro", 404, "Pedido não encontrado");
        }

        await this.pedidoRepository.update(id, pedidoData);
        await this.getPedidoById(id);

        return this.appService.message("sucesso", 200, "Pedido atualizado com sucesso");
    }

    /**
     * Obtém um pedido específico pelo seu ID, incluindo seus itens e detalhes do cliente.
     * @param {number} id - O ID do pedido a ser buscado.
     * @returns {Promise<Pedido | null>} O pedido encontrado ou null se não existir.
     */
    async getPedidoById(id: number): Promise<Pedido | null> {
        return this.pedidoRepository
            .createQueryBuilder('pedido')
            .leftJoinAndSelect('pedido.cliente', 'cliente')
            .leftJoinAndSelect('pedido.itens', 'itens')
            .leftJoinAndSelect('itens.id_produto', 'produto')
            .select([
                'pedido.id',
                'pedido.status',
                'pedido.dataCriado',
                'pedido.dataAlterado',
                'cliente.id',
                'cliente.razao_social',
                'cliente.cnpj',
                'cliente.email',
                'itens.id',
                'itens.quantidade',
                'itens.valor_unitario',
                'itens.total',
                'itens.total_desconto',
                'produto.id',
                'produto.nome',
                'produto.descricao',
                'produto.valor',
                'produto.desconto',
                'produto.quantidade_estoque',
                'produto.status',
            ])
            .where('pedido.id = :id', { id })
            .getOne();
    }

    /**
     * Exclui um pedido pelo seu ID, atualizando o estoque dos produtos associados.
     * @param {number} id - O ID do pedido a ser excluído.
     * @returns {Promise<any>} Mensagem de sucesso ou erro.
     */
    async deletePedido(id: number): Promise<any> {
        if (isNaN(id)) {
            return this.appService.message("erro", 400, "ID do pedido inválido");
        }

        const pedido = await this.getPedidoById(id);

        if (!pedido) {
            return this.appService.message("erro", 404, "Pedido não encontrado");
        }

        for (const item of pedido.itens) {

            const produto = await this.produtoRepository.findOne({ where: { id: item.id_produto.id } });
            console.log('PRODUTO', produto);

            if (produto) {
                produto.quantidade_estoque += item.quantidade;
                await this.produtoRepository.save(produto);
            }
        }

        for (const item of pedido.itens) {
            await this.itemPedidoRepository.delete(item.id);
        }

        await this.pedidoRepository.delete(id);

        return this.appService.message("sucesso", 200, "Pedido deletado e estoque atualizado com sucesso");
    }



}