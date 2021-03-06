import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { GtplanService } from 'src/infra/gtplan/gtplan.service';
import { TagGtplan } from 'src/infra/gtplan/tag';
import { Repository } from 'typeorm';
import { Optional } from 'typescript-optional';
import { Tag } from '../domain/tag';
import { TagLida } from './cmd/tag-lida.cmd';

@EventsHandler(TagLida)
export class TagLidaHandler implements IEventHandler<TagLida> {

  constructor(
    @Inject('SERVICO_REPOSITORY')
    private repository: Repository<Tag>,
    private readonly gtplanService: GtplanService,
  ) {}

  async handle(command: TagLida) {
    const tag: Tag = Tag.of(command.tag);

    const tagDb: Optional<Tag> = Optional.ofNullable(
      await this.repository.findOne(command.tag),
    );
    
    tagDb.ifPresentOrElse(tag => {
      tag.movimentar();
      tag.enviar('E', false);
      this.repository.save(tag);
    }, () => {
      tag.enviar('E', true);
      this.repository.save(tag);
      // this.gtplanService.send(TagGtplan.of(tag));    
  
    });

  }
}
