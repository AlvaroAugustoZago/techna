import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Tag } from '../domain/tag';
import { ViewGateway } from '../ui/events.gateway';
import { Repository } from 'typeorm';
import { TagLida } from './cmd/tag-lida.cmd';
import { Optional } from 'typescript-optional';

@EventsHandler(TagLida)
export class TagLidaHandler implements IEventHandler<TagLida> {
  tags: Array<{
    tag: string;
    rssi: number;
    antena: number;
    count: number;
    readTime: number;
  }> = [];

  constructor(
    private readonly antenaGateway: ViewGateway,
    @Inject('SERVICO_REPOSITORY')
    private repository: Repository<Tag>,
  ) {}

  async handle(command: TagLida) {
    const tag: Tag = Tag.of(command.tag, command.readTime, command.antena);

    const tagDb: Optional<Tag> = Optional.ofNullable(
      await this.repository.findOne(command.tag),
    );

    tagDb.ifPresentOrElse(
      (tag: Tag) => {
        tag.movimentar(command.readTime, command.antena);
        this.repository.save(tag);
      },
      () => {
        this.repository.save(tag);
      },
    );

    //this.antenaGateway.server.emit('exibTag', tag);
  }
}
