// src/app/utils/UtilService.ts

import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { environment } from './env';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private baseUrl = environment.apiUrl;
  private axiosInstance: AxiosInstance;

  constructor() {
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


}
