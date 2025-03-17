import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProdutoService } from '../service/produto.service';
import { Produto } from '../entities/produto.entity';

@Controller('produto')
export class ProdutoController {
    constructor(
        private produtoService: ProdutoService
    ) { }

    @Get()
    async getProdutos(): Promise<Produto[]> {
        return this.produtoService.getProduto();
    }

    @Get(':id')
    async getProdutoById(@Param('id') id: number): Promise<Produto | null> {
        return this.produtoService.getProdutoById(id);
    }

    @Post('cadastrar')
    async postProduto(
        @Body() body: Partial<Produto>,
        @Body('imagens') imagens: string[]
    ): Promise<any> {
        return this.produtoService.createProduto(body, imagens);
    }

    @Put('alterar/:id')
    async updateProduto(
        @Param('id') id: number,
        @Body() body: { produto: Partial<Produto>, photos: string[] }
    ): Promise<Produto | null> {
        const { produto, photos } = body;
        return this.produtoService.updateProduto(id, produto, photos);
    }

    @Delete('deletar/:id')
    async deleteProduto(@Param('id') id: number): Promise<void> {
        return this.produtoService.deleteProduto(id);
    }
}
