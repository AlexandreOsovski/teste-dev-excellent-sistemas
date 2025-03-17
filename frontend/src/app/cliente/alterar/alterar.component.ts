import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../utils/UtilService';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

import { debounceTime, switchMap } from 'rxjs/operators';

interface Cliente {
  id: number;
  razao_social: string;
  cnpj: string;
  email: string;
  status_id: string;
  dataCriado: string;
  dataAlterado: string;
}



@Component({
  selector: 'app-alterar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alterar.component.html',
  styleUrl: './alterar.component.scss'
})



export class AlterarComponent implements OnInit {
  clienteForm: FormGroup;
  clienteId: string | undefined;

  constructor(
    private utils: UtilService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.clienteForm = this.fb.group({
      razao_social: ['', [Validators.required]],
      email: ['', [Validators.required]],
      cnpj: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.clienteId = this.route.snapshot.paramMap.get('id') || '';
    if (this.clienteId) {
      this.buscarCliente(this.clienteId);
    }

    this.clienteForm.get('cnpj')?.valueChanges.subscribe((value) => {
      const cnpjComMascara = this.utils.mascaraCnpj(value);
      this.clienteForm.get('cnpj')?.setValue(cnpjComMascara, { emitEvent: false });
    });

    this.clienteForm.get('cnpj')?.valueChanges.pipe(
      debounceTime(500),
      switchMap(cnpj => this.utils.buscarDadosCnpj(cnpj))
    ).subscribe(dados => {
      if (dados && dados.razao_social) {
        console.log(dados);
        this.clienteForm.patchValue({
          razao_social: dados.razao_social,
          email: dados.estabelecimento.email
        });
      }
    });
  }

  async buscarCliente(id: string) {
    try {
      const response = await this.utils.getRequest<Cliente>('cliente/' + id, {});
      const cliente = response.data;

      this.clienteForm.patchValue({
        cnpj: cliente.cnpj,
        razao_social: cliente.razao_social,
        email: cliente.email,
      });
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
    }
  }


  perguntarSeDesejaAlterar() {
    this.utils.cardSweetAlert('Salvar cliente', 'Deseja salvar o cliente?', true, () => this.salvarCliente(), 'Sim, Alterar!');
  }

  async salvarCliente() {
    if (this.clienteForm.valid) {
      try {
        const request = await this.utils.putRequest('cliente/alterar/' + this.clienteId, this.clienteForm.value);
        console.log(request);

        if (request.status === 200) {
          const result = await Swal.fire({
            title: 'Sucesso!',
            text: 'Cliente alterado com sucesso',
            icon: 'success',
            confirmButtonText: 'OK'
          });

          if (result.isConfirmed) {
            window.location.href = '/cliente';
          }
        } else {
          await Swal.fire('Opss...', 'Houve um erro ao alterar o cliente.');
        }
      } catch (error) {
        console.error('Erro ao alterar cliente:', error);
        await Swal.fire('Opss...', 'Houve um erro ao alterar o cliente.');
      }
    }
  }

}
