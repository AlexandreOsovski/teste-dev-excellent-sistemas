import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../utils/UtilService';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../models/pedido.model';

@Component({
  selector: 'app-alterar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alterar.component.html',
  styleUrl: './alterar.component.scss'
})
export class AlterarComponent implements OnInit {

  pedidos: Pedido | null = null;
  pedidoId: number | string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private utils: UtilService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pedidoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.pedidoId) {
      this.getPedidos();
    } else {
      this.errorMessage = 'ID do pedido não fornecido.';
      this.isLoading = false;
    }
  }

  async getPedidos() {
    try {
      const response = await this.utils.getRequest<Pedido>('pedido/' + this.pedidoId);
      this.pedidos = response.data;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      this.errorMessage = 'Erro ao carregar os dados do pedido. Tente novamente mais tarde.';
    } finally {
      this.isLoading = false;
    }
  }
}
