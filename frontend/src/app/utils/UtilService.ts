// src/app/utils/UtilService.ts

import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { environment } from './env';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private baseUrl = environment.apiUrl;
  private axiosInstance: AxiosInstance;

  constructor(private http: HttpClient) {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  getRequest<T>(endpoint: string, params?: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(endpoint, { params });
  }

  postRequest<T>(endpoint: string, body: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(endpoint, body);
  }

  putRequest<T>(endpoint: string, body: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(endpoint, body);
  }

  deleteRequest<T>(endpoint: string): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(endpoint);
  }


  cardSweetAlert(titulo: string, observacao: string, mostrarBotaoCancelarAcao: boolean, funcao: any, textoBotaoConfirmacao: string = 'Sim, excluir!') {
    Swal.fire({
      title: titulo,
      text: observacao,
      icon: 'warning',
      showCancelButton: mostrarBotaoCancelarAcao,
      confirmButtonText: textoBotaoConfirmacao,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        funcao();
      }
    });
  }


  buscarDadosCnpj(cnpj: string) {
    if (!cnpj) {
      return '';
    }
    const cnpjSemCaracteresEspeciais = cnpj.replace(/\D/g, '');
    if (cnpjSemCaracteresEspeciais.length === 14) {
      return this.http.get<any>(`https://publica.cnpj.ws/cnpj/${cnpjSemCaracteresEspeciais}`);
    } else {
      return [];
    }
  }


  mascaraCnpj(cnpj: string): string {
    if (!cnpj) {
      return '';
    }

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



}
