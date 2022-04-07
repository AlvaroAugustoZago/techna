import { CommandBus } from '@nestjs/cqrs';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Limpar } from 'src/app/cmd/limar.cmd';
import { StartServer } from 'src/app/cmd/start-server.cmd';
import { StopServer } from 'src/app/cmd/stop-server.cmd';

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

  @SubscribeMessage('start')
  start(@MessageBody() data: any): void {
    this.commandBus.execute(StartServer.of(data[0], data[1], data[2], data[3]));
  }

  @SubscribeMessage('stop')
  stop(): void {
    this.commandBus.execute(new StopServer());
  }

  @SubscribeMessage('limpar')
  limpar(): void {
    this.commandBus.execute(new Limpar());
  }
}
