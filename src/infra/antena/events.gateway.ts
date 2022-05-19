import { CommandBus, EventBus } from '@nestjs/cqrs';
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
import { LeituraConcluida } from 'src/app/cmd/leituraConcluida.cmd';
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

  constructor(private readonly eventBus: EventBus, private readonly commandBus: CommandBus) {}

  @SubscribeMessage('tag')
  findAll(@MessageBody() data: any): void {
    const [tag, count, rssi, antena, readTime, statusLeitura] = data.split(',');

    this.eventBus.publish(new TagLida(tag, rssi, Number(antena), count, readTime));
  }
  
  @SubscribeMessage('leitura_completa')
  leituraCompleta(@MessageBody() data: Array<string>): void {
    if (Array.isArray(data) && data.length) {
      this.commandBus.execute(new LeituraConcluida());
    }

    for (let tag of data) {
      const [epc, rssi, antena] = tag.split(',');
      
      this.eventBus.publish(new TagLida(epc, Number(rssi), Number(antena), 0, "0"));
    }

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
