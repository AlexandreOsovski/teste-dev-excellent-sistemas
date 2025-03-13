import { Injectable, Delete } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Produto } from './../entities/produto.entity';
import { ProdutoImagem } from '../entities/produtoImagem.entity';
import { AppService } from 'src/app.service';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,

        @InjectRepository(ProdutoImagem)
        private produtoImagemRepository: Repository<ProdutoImagem>,

        private appService: AppService
    ) { }

    async getProduto(): Promise<Produto[]> {
        return this.produtoRepository
            .createQueryBuilder('produto')
            .leftJoinAndSelect('produto.imagens', 'imagens')
            .select([
                'produto.id',
                'produto.nome',
                'produto.descricao',
                'produto.valor',
                'produto.desconto',
                'produto.quantidade_estoque',
                'produto.status',
                'produto.dataCriado',
                'produto.dataAlterado',
                'imagens.url',
            ])
            .getMany();
    }

    async getProdutoById(id: number): Promise<Produto | null> {
        return this.produtoRepository.findOne(({ where: { id } }));
    }

    async createProduto(produtoData: Partial<Produto>, photos: string[]): Promise<any> {
        console.log(photos)
        const produto = this.produtoRepository.create(produtoData);
        const savedProduto = await this.produtoRepository.save(produto);
        await this.savePhotos(savedProduto.id, photos);
        return this.appService.message("sucesso", 201, "Produto criado com sucesso");
    }

    async updateProduto(id: number, produtoData: Partial<Produto>): Promise<Produto | null> {
        const produto = await this.produtoRepository.findOne({ where: { id } });
        if (!produto) {
            return null;
        }
        Object.assign(produto, produtoData);
        return this.produtoRepository.save(produto);
    }

    async deleteProduto(id: number): Promise<void> {
        await this.produtoImagemRepository.delete({ idproduto: id });
        await this.produtoRepository.delete(id);

        const dir = path.join(__dirname, '../../../uploads', 'produtos', id.toString());

        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    }

    private async savePhotos(productId: number, imagens: string[]): Promise<void> {
        if (!imagens || imagens.length === 0) {
            return;
        }

        const dir = path.join(__dirname, '../../../uploads', 'produtos', productId.toString());
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        for (const base64Image of imagens) {
            const base64Data = base64Image.split(';base64,')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            const imageName = `${randomUUID()}.jpg`;
            const imagePath = path.join(dir, imageName);
            fs.writeFileSync(imagePath, buffer);

            const produtoImagem = this.produtoImagemRepository.create({
                idproduto: productId,
                url: `/uploads/produtos/${productId}/${imageName}`,
            });

            await this.produtoImagemRepository.save(produtoImagem);
        }
    }
}
