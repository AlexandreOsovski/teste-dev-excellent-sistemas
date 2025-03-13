import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../utils/UtilService';
import Swal from 'sweetalert2';
import { environment } from '../../utils/env';

@Component({
  selector: 'app-cadastrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})


export class CadastrarComponent {

  produtoForm: FormGroup;

  constructor(private fb: FormBuilder, private utils: UtilService) {
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      valor: [null, [Validators.required]],
      desconto: [null],
      quantidade_estoque: [null, [Validators.required]],
      status: ['ativo'],
      imagens: this.fb.array([])
    });
  }

  get imagens() {
    return (this.produtoForm.get('imagens') as FormArray);
  }

  addImage() {
    this.imagens.push(this.fb.control('', Validators.required));
  }

  removeImage(index: number) {
    this.imagens.removeAt(index);
  }

  onFileChange(event: any, index: number): void {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(fileList[0]);

      reader.onload = () => {
        this.imagens.at(index).setValue(reader.result as string);
      };
    }
  }

  perguntarSeDesejaSalvar() {
    this.utils.cardSweetAlert('Salvar Produto', 'Deseja salvar o produto?', true, () => this.salvarProduto(), 'Sim, Cadastrar!');
  }

  async salvarProduto() {
    if (this.produtoForm.valid) {
      const request = await this.utils.postRequest('produto/cadastrar', this.produtoForm.value);
      console.log(request)
      if (request.status == 201 && request.statusText == 'Created') {
        Swal.fire('Sucesso!', 'Produto Cadastrado com sucesso')
        window.location.href = '/produto';
      } else {
        Swal.fire('Opss...', 'Houve um erro ao cadastrar o produto.')
      }
    }
  }
}
