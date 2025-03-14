import { Routes } from '@angular/router';

//PEDIDO
import { PedidoComponent } from './pedido/pedido.component';
import { CadastrarComponent as CadastrarPedido } from './pedido/cadastrar/cadastrar.component';
import { AlterarComponent as AlterarPedido } from './pedido/alterar/alterar.component';

//CLIENTE
import { ClienteComponent } from './cliente/cliente.component';
import { CadastrarComponent as CadastrarCliente } from './cliente/cadastrar/cadastrar.component';
import { AlterarComponent as AlterarCliente } from './cliente/alterar/alterar.component';

//PRODUTO
import { ProdutoComponent } from './produto/produto.component';
import { AlterarComponent as AlterarProduto } from './produto/alterar/alterar.component';
import { CadastrarComponent as CadastrarProduto } from './produto/cadastrar/cadastrar.component';

export const routes: Routes = [
  { path: '', component: PedidoComponent },
  { path: 'pedido/alterar/:id', component: AlterarPedido },
  { path: 'pedido/cadastrar', component: CadastrarPedido },

  { path: 'cliente', component: ClienteComponent },
  { path: 'cliente/alterar/:id', component: AlterarCliente },
  { path: 'cliente/cadastrar', component: CadastrarCliente },

  { path: 'produto', component: ProdutoComponent },
  { path: 'produto/alterar/:id', component: AlterarProduto },
  { path: 'produto/cadastrar', component: CadastrarProduto }
];
