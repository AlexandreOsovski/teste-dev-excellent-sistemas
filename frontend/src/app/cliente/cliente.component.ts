import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilService } from '../utils/UtilService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
})
export class ClienteComponent implements OnInit {
  clientes: any;

  constructor(private utils: UtilService) { }

  ngOnInit(): void {
    this.getClientes();
  }

  async getClientes() {
    try {
      const response = await this.utils.getRequest('cliente');
      this.clientes = response.data;

    } catch (error) {
      console.error('Erro ao obter os produtos:', error);
    }
  }

  excluirCliente(clienteId: number) {
    this.utils.cardSweetAlert(
      'Você tem certeza?',
      'Essa ação não pode ser desfeita!',
      true,
      () => this.deletarCliente(clienteId)
    );
  }

  async deletarCliente(clienteId: number) {
    try {
      const response = await this.utils.deleteRequest(`cliente/deletar/${clienteId}`);
      if (response.status == 200) {
        Swal.fire('Excluído!', 'O cliente foi excluído com sucesso.', 'success');
        this.getClientes();
      } else {
        Swal.fire('Erro!', 'Houve um problema ao excluir o cliente.', 'error');
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      Swal.fire('Erro!', 'Houve um problema ao excluir o cliente.', 'error');
    }
  }
}
