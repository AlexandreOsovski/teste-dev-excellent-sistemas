import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }

  message(status: string, statusCode: number, mensagem: string): any {
    return {
      status,
      statusCode,
      mensagem,
    };
  }

  getHello(): any {
    return this.message('sucesso', 200, 'Operação realizada com sucesso');
  }

  getError(): any {
    return this.message('erro', 500, 'Ocorreu um erro interno');
  }
}
