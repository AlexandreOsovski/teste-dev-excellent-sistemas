import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { glob } from 'glob';
import { AppService } from './app.service';
import { ClienteController } from './cliente/controller/cliente.controller';
import { ProdutoController } from './produto/controller/produto.controller';
import { ProdutoService } from './produto/service/produto.service';
import { ClienteService } from './cliente/service/cliente.service';
import { Cliente } from './cliente/entities/cliente.entity';
import { Produto } from './produto/entities/produto.entity';
import { PedidoController } from './pedido/controller/pedido.controller';
import { PedidoService } from './pedido/service/pedido.service';
import { ProdutoImagem } from './produto/entities/produtoImagem.entity';
import { Pedido } from './pedido/entities/pedido.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ItemPedido } from './pedido/entities/items_pedido.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Cliente, Produto, ProdutoImagem, Pedido, ItemPedido],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Cliente, Produto, ProdutoImagem, Pedido, ItemPedido]),
  ],
  controllers: [ClienteController, ProdutoController, PedidoController],
  providers: [AppService, ProdutoService, ClienteService, PedidoService],
})
export class AppModule { }
