import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from '../utils/UtilService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss'
})
export class PedidoComponent implements OnInit {

  pedidos: any;
  cliente: any;

  constructor(private utils: UtilService) { }

  ngOnInit(): void {
    this.getPedidos();
  }


  async getPedidos() {
    try {
      const response = await this.utils.getRequest('pedido');
      this.pedidos = response.data;
      console.log(response.data)

    } catch (error) {
      console.error('Erro ao obter os pedidos:', error);
    }
  }

  excluirPedido(pedidoId: number) {
    this.utils.cardSweetAlert(
      'Você tem certeza?',
      'Essa ação não pode ser desfeita!',
      true,
      () => this.deletarPedido(pedidoId)
    );
  }

  async deletarPedido(pedidoId: number) {
    try {
      const response = await this.utils.deleteRequest(`pedido/deletar/${pedidoId}`);
      if (response.status == 200) {
        Swal.fire('Excluído!', 'O pedido foi excluído com sucesso.', 'success');
        this.getPedidos();
      } else {
        Swal.fire('Erro!', 'Houve um problema ao excluir o pedido.', 'error');
      }
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      Swal.fire('Erro!', 'Houve um problema ao excluir o pedido.', 'error');
    }
  }
}

