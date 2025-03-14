import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../utils/UtilService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../utils/env';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})
export class CadastrarComponent implements OnInit {
  clientes: any;
  produtos: any;
  carrinho: any[] = [];
  baseUrl: string;
  clienteId: number | null = null;  // Cliente selecionado

  constructor(
    private utils: UtilService
  ) {
    this.baseUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.getClientes();
    this.getProdutos();
    this.carregarCarrinho();
  }

  async getClientes() {
    try {
      const response = await this.utils.getRequest('cliente');
      this.clientes = response.data;
    } catch (error) {
      console.error('Erro ao obter os clientes:', error);
    }
  }

  async getProdutos() {
    try {
      const response = await this.utils.getRequest('produto');
      this.produtos = response.data;

      this.produtos.forEach((produto: any) => {
        produto.quantidadeSelecionada = 1;
      });
    } catch (error) {
      console.error('Erro ao obter os produtos:', error);
    }
  }

  carregarCarrinho() {
    const carrinhoStorage = localStorage.getItem('carrinho');
    if (carrinhoStorage) {
      this.carrinho = JSON.parse(carrinhoStorage);
    }
  }

  validarQuantidade(produto: any) {
    if (produto.quantidadeSelecionada > produto.estoque) {
      produto.quantidadeSelecionada = produto.estoque;
    }
  }

  adicionarAoCarrinho(produto: any) {
    const produtoNoCarrinho = this.carrinho.find(item => item.id === produto.id);

    if (produtoNoCarrinho) {
      produtoNoCarrinho.quantidade += produto.quantidadeSelecionada;
      produtoNoCarrinho.total = produtoNoCarrinho.quantidade * produtoNoCarrinho.preco;
    } else {
      this.carrinho.push({
        id: produto.id,
        nome: produto.nome,
        quantidade: produto.quantidadeSelecionada,
        preco: produto.valor,
        total: produto.quantidadeSelecionada * produto.valor,
      });
    }

    this.salvarCarrinho();
  }

  removerDoCarrinho(produtoId: number) {
    this.carrinho = this.carrinho.filter(item => item.id !== produtoId);
    this.salvarCarrinho();
  }

  salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
  }

  atualizarClienteSelecionado() {
    if (this.clienteId !== null) {
      const clienteSelecionado = this.clientes?.find((cliente: { id: number | null; }) => cliente.id === this.clienteId);

      if (clienteSelecionado) {
        console.log('Cliente Selecionado:', clienteSelecionado);
      } else {
        console.log('Cliente não encontrado.');
      }
    }
  }

  async enviarPedido() {
    if (this.clienteId === null) {
      alert('Por favor, selecione um cliente!');
      return;
    }

    if (this.carrinho.length === 0) {
      alert('O carrinho está vazio! Não é possível enviar o pedido.');
      return;
    }

    try {
      const totalPedido = this.calcularTotal();

      // Prepare o pedido com os valores corretos
      const pedido = {
        pedidoData: {
          cliente: { id: this.clienteId },
          status: 'pendente',
          total: totalPedido,
          dataCriado: new Date().toISOString(),
          dataAlterado: new Date().toISOString(),
        },
        items: this.carrinho.map(item => ({
          produtoId: item.id,
          quantidade: item.quantidade || 1, // Garantir que quantidade não seja undefined
          valorUnitario: item.preco || 0, // Garantir que preço não seja undefined
          totalDesconto: 0,
          totalItem: item.total || (item.quantidade * item.preco) // Garantir que total seja calculado corretamente
        }))
      };

      console.log('Pedido a ser enviado:', pedido);

      const response = await this.utils.postRequest('pedido/cadastrar', pedido);

      if (response.status) {
        alert('Pedido enviado com sucesso!');
        this.carrinho = [];
        this.salvarCarrinho();
      } else {
        alert('Erro ao enviar o pedido.');
      }
    } catch (error) {
      console.error('Erro ao enviar o pedido:', error);
      alert('Erro ao enviar o pedido.');
    }
  }

  calcularTotal() {
    return this.carrinho.reduce((total, item) => total + item.total, 0);
  }

  onClienteChange(clienteId: number) {
    this.clienteId = clienteId;
    this.atualizarClienteSelecionado();
  }
}
