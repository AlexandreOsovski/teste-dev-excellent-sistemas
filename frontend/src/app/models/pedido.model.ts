import { Cliente } from './cliente.model';
import { ItemPedido } from './item-pedido.model';

export interface Pedido {
  id: number;
  cliente: Cliente;
  status: string;
  dataCriado: string;
  dataAlterado: string;
  itens: ItemPedido[];
}
