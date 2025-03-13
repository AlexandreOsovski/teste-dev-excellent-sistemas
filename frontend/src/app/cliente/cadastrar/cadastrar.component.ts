import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../utils/UtilService';
import Swal from 'sweetalert2';

import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastrar.component.html',
  styleUrl: './cadastrar.component.scss'
})
export class CadastrarComponent implements OnInit {
  clienteForm: FormGroup;
  constructor(
    private utils: UtilService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {

    this.clienteForm = this.fb.group({
      razao_social: ['', [Validators.required]],
      email: ['', [Validators.required]],
      cnpj: ['', [Validators.required]]
    });

  }


  ngOnInit(): void {

    this.clienteForm.get('cnpj')?.valueChanges.subscribe((value) => {
      const cnpjComMascara = this.mascaraCnpj(value);
      this.clienteForm.get('cnpj')?.setValue(cnpjComMascara, { emitEvent: false });
    });

    this.clienteForm.get('cnpj')?.valueChanges.pipe(
      debounceTime(500),
      switchMap(cnpj => this.buscarDadosCnpj(cnpj))
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

  perguntarSeDesejaSalvar() {
    this.utils.cardSweetAlert('Salvar cliente', 'Deseja salvar o cliente?', true, () => this.salvarCliente(), 'Sim, Cadastrar!');
  }

  buscarDadosCnpj(cnpj: string) {
    const cnpjSemCaracteresEspeciais = cnpj.replace(/\D/g, '');
    if (cnpjSemCaracteresEspeciais.length === 14) {
      return this.http.get<any>(`https://publica.cnpj.ws/cnpj/${cnpjSemCaracteresEspeciais}`);
    } else {
      return [];
    }
  }


  mascaraCnpj(cnpj: string): string {
    let cnpjLimpo = cnpj.replace(/\D/g, '');

    if (cnpjLimpo.length <= 2) {
      return cnpjLimpo;
    } else if (cnpjLimpo.length <= 5) {
      return cnpjLimpo.replace(/(\d{2})(\d{1})/, '$1.$2');
    } else if (cnpjLimpo.length <= 8) {
      return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{1})/, '$1.$2.$3');
    } else if (cnpjLimpo.length <= 12) {
      return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3/$4');
    } else if (cnpjLimpo.length <= 14) {
      return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cnpjLimpo;
  }


  async salvarCliente() {
    if (this.clienteForm.valid) {
      const request = await this.utils.postRequest('cliente/cadastrar', this.clienteForm.value);
      console.log(request)
      if (request.status == 201 && request.statusText == 'Created') {
        Swal.fire('Sucesso!', 'Cliente Cadastrado com sucesso')
        window.location.href = '/cliente';
      } else {
        Swal.fire('Opss...', 'Houve um erro ao cadastrar o produto.')
      }
    }
  }
}
