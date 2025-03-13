import { Routes } from '@angular/router';
import { PedidoComponent } from './pedido/pedido.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ProdutoComponent } from './produto/produto.component';
import { CadastrarComponent as CadastrarCliente } from './cliente/cadastrar/cadastrar.component';
import { CadastrarComponent as CadastrarProduto } from './produto/cadastrar/cadastrar.component';

export const routes: Routes = [
  { path: '', component: PedidoComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'cliente/cadastrar', component: CadastrarCliente },
  { path: 'produto', component: ProdutoComponent },
  { path: 'produto/cadastrar', component: CadastrarProduto }
];
