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
import { GetEstoque } from 'src/app/cmd/getEstoque.cmd';
import { Limpar } from 'src/app/cmd/limar.cmd';
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
    this.commandBus.execute(Configurar.of(data[0], data[1], data[2], data[3]));
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
}
