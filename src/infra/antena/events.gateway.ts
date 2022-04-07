import { EventBus } from '@nestjs/cqrs';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TagLida } from 'src/app/cmd/tag-lida.cmd';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'rfid',
})
export class AntenaGateway  {
  
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventBus: EventBus ) {}
  
  @SubscribeMessage('tag')
  findAll(@MessageBody() data: any): void {
    const [tag, count, rssi, antena, readTime, statusLeitura] = data.split(',')


    this.eventBus.publish(new TagLida(tag,rssi,antena, count, readTime));
  }
}
