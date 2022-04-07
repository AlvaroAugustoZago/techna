import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ViewGateway } from 'src/ui/events.gateway';
import { TagLida } from './cmd/tag-lida.cmd';

@EventsHandler(TagLida)
export class TagLidaHandler implements IEventHandler<TagLida> {
  tags: Array<{
    tag: string;
    rssi: number;
    antena: number;
    count: number;
    readTime: number;
  }> = [];

  constructor(private readonly antenaGateway: ViewGateway) {}

  async handle(command: TagLida) {
    let tagObj;
    const index = this.tags.findIndex(
      (item) => item.antena === command.antena && item.tag === command.tag,
    );
    if (index === -1) {
      this.tags.push(command);
      tagObj = command;
    } else {
      this.tags[index].count = command.count;
      this.tags[index].rssi = command.rssi;
      this.tags[index].readTime = command.readTime;

      tagObj = this.tags[index];
    }

    this.antenaGateway.server.emit('exibTag', tagObj);
  }
}
