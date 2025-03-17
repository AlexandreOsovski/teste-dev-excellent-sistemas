import { Produto } from './produto.model';

export interface ItemPedido {
  id: number;
  id_produto: Produto;
  quantidade: number;
  valor_unitario: string;
  total: string;
  total_desconto: string;
}
