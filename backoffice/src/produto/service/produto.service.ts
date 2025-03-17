import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Produto } from './../entities/produto.entity';
import { ProdutoImagem } from '../entities/produtoImagem.entity';
import { AppService } from 'src/app.service';
import { randomUUID } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProdutoService {
    constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>,

        @InjectRepository(ProdutoImagem)
        private produtoImagemRepository: Repository<ProdutoImagem>,

        private appService: AppService,
        private configService: ConfigService
    ) { }

    /**
     * Obtém todos os produtos cadastrados, ordenados por ID em ordem decrescente.
     * @returns {Promise<Produto[]>} Uma lista de produtos com suas imagens.
     */
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
            .orderBy('produto.id', 'DESC')
            .getMany();
    }

    /**
     * Obtém um produto específico pelo seu ID.
     * @param {number} id - O ID do produto a ser buscado.
     * @returns {Promise<Produto | null>} O produto encontrado ou null se não existir.
     */
    async getProdutoById(id: number): Promise<Produto | null> {
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
            .where('produto.id = :id', { id })
            .getOne();
    }

    /**
     * Cria um novo produto com os dados fornecidos e associa as imagens enviadas.
     * @param {Partial<Produto>} produtoData - Dados do produto a serem criados.
     * @param {string[]} photos - Lista de URLs ou dados base64 das imagens do produto.
     * @returns {Promise<any>} Mensagem de sucesso ou erro.
     */
    async createProduto(produtoData: Partial<Produto>, photos: string[]): Promise<any> {
        const produto = this.produtoRepository.create(produtoData);
        const savedProduto = await this.produtoRepository.save(produto);

        if (photos && photos.length > 0) {
            await this.handleProdutoImages(savedProduto.id, photos);
        }

        return this.appService.message("sucesso", 201, "Produto criado com sucesso");
    }

    /**
     * Exclui um produto pelo seu ID, removendo também suas imagens e o diretório de uploads.
     * @param {number} id - O ID do produto a ser excluído.
     * @returns {Promise<void>}
     */
    async deleteProduto(id: number): Promise<void> {
        await this.produtoImagemRepository.delete({ idproduto: id });
        await this.produtoRepository.delete(id);

        const dir = path.join(__dirname, '../../../uploads', 'produtos', id.toString());

        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    }

    /**
     * Atualiza os dados de um produto existente e gerencia suas imagens.
     * @param {number} id - O ID do produto a ser atualizado.
     * @param {Partial<Produto>} produtoData - Novos dados do produto.
     * @param {string[]} photos - Lista de URLs ou dados base64 das novas imagens.
     * @returns {Promise<Produto | null>} O produto atualizado ou null se não for encontrado.
     */
    async updateProduto(id: number, produtoData: Partial<Produto>, photos: string[]): Promise<Produto | null> {
        const produto = await this.produtoRepository.findOne({
            where: { id },
            relations: ['imagens'],
        });

        if (!produto) {
            return null;
        }

        Object.assign(produto, {
            nome: produtoData.nome,
            descricao: produtoData.descricao,
            valor: produtoData.valor,
            desconto: produtoData.desconto,
            quantidade_estoque: produtoData.quantidade_estoque,
            status: produtoData.status,
        });

        await this.produtoRepository.save(produto);

        await this.handleProdutoImages(id, photos);

        return produto;
    }

    /**
     * Gerencia as imagens de um produto, adicionando novas e removendo as antigas.
     * @param {number} productId - O ID do produto.
     * @param {string[]} imagens - Lista de URLs ou dados base64 das imagens.
     * @returns {Promise<void>}
     */
    private async handleProdutoImages(productId: number, imagens: string[]): Promise<void> {
        if (!imagens || imagens.length === 0) {
            return;
        }

        const imagensAtuais = await this.produtoImagemRepository.find({
            where: { idproduto: productId },
        });

        const novasUrls = new Set(imagens.map(img => path.basename(img)));

        for (const imagemAtual of imagensAtuais) {
            if (!novasUrls.has(path.basename(imagemAtual.url))) {
                await this.produtoImagemRepository.delete(imagemAtual.id);

                const caminhoImagem = path.join(
                    __dirname,
                    '../../../uploads',
                    'produtos',
                    productId.toString(),
                    path.basename(imagemAtual.url)
                );
                if (fs.existsSync(caminhoImagem)) {
                    fs.unlinkSync(caminhoImagem);
                }
            }
        }

        for (const image of imagens) {
            if (image.startsWith('data:image/')) {
                await this.saveBase64Image(productId, image);
            } else if (image.startsWith(`${this.configService.get('BASE_URL')}/uploads/produtos/`)) {
                const urlSemBase = image.replace(`${this.configService.get('BASE_URL')}`, '');
                const imagemExistente = imagensAtuais.find(img => img.url === urlSemBase);

                if (imagemExistente) {
                    await this.produtoImagemRepository.update(imagemExistente.id, {
                        url: urlSemBase,
                    });
                } else {
                    await this.produtoImagemRepository.save({
                        idproduto: productId,
                        url: urlSemBase,
                    });
                }
            }
        }
    }

    /**
     * Salva uma imagem em formato base64 no diretório de uploads e associa ao produto.
     * @param {number} productId - O ID do produto.
     * @param {string} base64Image - A imagem em formato base64.
     * @returns {Promise<void>}
     */
    private async saveBase64Image(productId: number, base64Image: string): Promise<void> {
        const dir = path.join(__dirname, '../../../uploads', 'produtos', productId.toString());
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

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