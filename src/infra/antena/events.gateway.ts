import { EventBus } from '@nestjs/cqrs';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'socket.io';
import { TagLida } from 'src/app/cmd/tag-lida.cmd';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'rfid',
  transports: ['websocket', 'polling'] 
})
export class AntenaGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventBus: EventBus) {}

  @SubscribeMessage('tag')
  findAll(@MessageBody() data: any): void {
    const [tag, count, rssi, antena, readTime, statusLeitura] = data.split(',');

    this.eventBus.publish(new TagLida(tag, rssi, Number(antena), count, readTime));
  }

  @SubscribeMessage('erro')
  erro(): void {
    // this.eventBus.publish(new TagLida(tag, rssi, Number(antena), count, readTime));
  }

  afterInit(server: Server) {
    console.log('Initialised!');
  }

  handleConnection(client: Socket, ...args: any[]): any {
    console.log(`Client connected: `);
  }

  handleDisconnect(client: Socket): any {
    console.log(`Client disconnected: `);
  }
}
