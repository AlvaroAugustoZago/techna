import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { Optional } from 'typescript-optional';
import { Tag } from '../domain/tag';
import { TagLida } from './cmd/tag-lida.cmd';

@EventsHandler(TagLida)
export class TagLidaHandler implements IEventHandler<TagLida> {

  constructor(
    @Inject('SERVICO_REPOSITORY')
    private repository: Repository<Tag>,
  ) {}

  async handle(command: TagLida) {
    const tag: Tag = Tag.of(command.tag);

    const tagDb: Optional<Tag> = Optional.ofNullable(
      await this.repository.findOne(command.tag),
    );

    tagDb.ifPresent((tag: Tag) => tag.movimentar());
    this.repository.save(tagDb.orElseGet(() => tag));
  }
}
