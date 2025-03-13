import { Component, OnInit } from '@angular/core';
import { UtilService } from '../utils/UtilService';
import Swal from 'sweetalert2'
import { CommonModule } from '@angular/common';
import { environment } from './../utils/env';
@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [CommonModule],

  templateUrl: './produto.component.html',
  styleUrl: './produto.component.scss'
})
export class ProdutoComponent implements OnInit {

  produtos: any;
  baseUrl = environment.apiUrl.replace(/\/$/, '');

  constructor(
    private utils: UtilService
  ) { }

  ngOnInit(): void {

    console.log(this.getProdutos())
    this.getProdutos();
  }

  async getProdutos() {
    try {
      const response = await this.utils.getRequest('produto');
      console.log(response.data)
      this.produtos = response.data;
    } catch (error) {
      console.error('Erro ao obter os produtos:', error);
    }
  }

  excluirProduto(produtoId: number) {
    this.utils.cardSweetAlert(
      'Você tem certeza?',
      'Essa ação não pode ser desfeita!',
      true,
      () => this.deletarProduto(produtoId)
    );
  }

  async deletarProduto(produtoId: number) {
    try {
      const response = await this.utils.deleteRequest(`produto/deletar/${produtoId}`);
      if (response.status == 200) {
        Swal.fire('Excluído!', 'O produto foi excluído com sucesso.', 'success');
        this.getProdutos();
      } else {
        Swal.fire('Erro!', 'Houve um problema ao excluir o produto.', 'error');
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      Swal.fire('Erro!', 'Houve um problema ao excluir o produto.', 'error');
    }
  }
}
