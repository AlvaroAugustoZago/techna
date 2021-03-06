import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Configurar } from 'src/app/cmd/configurar.cmd';
import { GetConfiguracoes } from 'src/app/cmd/getConfiguracoes.cmd';
import { GetEstoque } from 'src/app/cmd/getEstoque.cmd';
import { GetMovimentacoes } from 'src/app/cmd/getMovimentacoes.cmd';
import { Limpar } from 'src/app/cmd/limar.cmd';
import { PortaAberta } from 'src/app/cmd/portaAberta.cmd';
import { PortaFechada } from 'src/app/cmd/portaFechada.cmd';
import { StartServer } from 'src/app/cmd/start-server.cmd';
import { StopServer } from 'src/app/cmd/stop-server.cmd';
import { Tag } from 'src/domain/tag';
import { Repository } from 'typeorm/repository/Repository';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'view',
})
export class ViewGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly commandBus: CommandBus) {}

  @SubscribeMessage('configurar')
  configurar(@MessageBody() data: any): void {
    this.commandBus.execute(Configurar.of(data[0], data[1], data[2], data[3], data[4], data[5], data[6]));
  }

  @SubscribeMessage('start')
  start(@MessageBody() data: any): void {
    this.commandBus.execute(StartServer.of(data[0]));
  }

  @SubscribeMessage('stop')
  stop(): void {
    this.commandBus.execute(new StopServer());
  }

  @SubscribeMessage('limpar')
  limpar(): void {
    this.commandBus.execute(new Limpar());
  }

  @SubscribeMessage('estoque')
  estoque(): void {
    this.commandBus.execute(new GetEstoque());
  }

  @SubscribeMessage('movimentacoes')
  movimentacoes(): void {
    this.commandBus.execute(new GetMovimentacoes());
  }

  @SubscribeMessage('configuracoes')
  configuracoes(): void {
    this.commandBus.execute(new GetConfiguracoes());
  }

  @SubscribeMessage('porta-fechada')
  portaFechada(): void {
    this.commandBus.execute(new PortaFechada());
  }
 
  @SubscribeMessage('porta-aberta')
  portaAberta(): void {
    this.commandBus.execute(new PortaAberta());
  }
}
