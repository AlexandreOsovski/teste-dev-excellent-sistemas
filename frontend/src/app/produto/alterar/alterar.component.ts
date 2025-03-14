import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../utils/UtilService';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../utils/env';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  valor: string;
  desconto: string;
  quantidade_estoque: number;
  dataCriado: string;
  dataAlterado: string;
  imagens: { url: string }[];
}


@Component({
  selector: 'app-alterar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alterar.component.html',
  styleUrl: './alterar.component.scss'
})
export class AlterarComponent implements OnInit {
  produtoForm: FormGroup;
  clienteId: string | undefined;

  constructor(
    private utils: UtilService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      valor: [null, [Validators.required]],
      desconto: [null],
      quantidade_estoque: [null, [Validators.required]],
      imagens: this.fb.array([]) // FormArray para imagens
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.buscarProduto(id);
      }
    });
  }

  async buscarProduto(id: string) {
    try {
      const response = await this.utils.getRequest<Produto>('produto/' + id, {});
      const produto = response.data;
      console.log(produto)

      this.produtoForm.patchValue({
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        valor: produto.valor,
        desconto: produto.desconto,
        quantidade_estoque: produto.quantidade_estoque
      });

      this.setImagens(produto.imagens);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
    }
  }

  setImagens(imagens: { url: string }[]) {
    const imagensFormArray = this.produtoForm.get('imagens') as FormArray;
    imagensFormArray.clear();

    imagens.forEach(imagem => {
      imagensFormArray.push(this.fb.group({
        url: environment.apiUrl + imagem.url
      }));
    });
  }



  get imagens() {
    return (this.produtoForm.get('imagens') as FormArray);
  }

  onFileChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const imagensFormArray = this.produtoForm.get('imagens') as FormArray;
        imagensFormArray.at(index).patchValue({
          imagemUrl: reader.result as string
        });
      };

      reader.readAsDataURL(file);
    }
  }

  addImage() {
    const imagensFormArray = this.produtoForm.get('imagens') as FormArray;
    imagensFormArray.push(this.fb.group({
      imagemUrl: ['']
    }));
  }

  removeImage(index: number) {
    const imagensFormArray = this.produtoForm.get('imagens') as FormArray;
    imagensFormArray.removeAt(index);
  }

  perguntarSeDesejaSalvar() {

  }
}
