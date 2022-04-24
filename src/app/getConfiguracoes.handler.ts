import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Configuracao } from 'src/domain/configuracao';
import { Produto } from 'src/domain/produto';
import { Tag } from 'src/domain/tag';
import { ViewGateway } from 'src/ui/events.gateway';
import { Repository } from 'typeorm';
import { GetConfiguracoes } from './cmd/getConfiguracoes.cmd';

@CommandHandler(GetConfiguracoes)
export class GetConfiguracoesHandler implements ICommandHandler<GetConfiguracoes> {
  constructor(
    private readonly viewGateway: ViewGateway,

    @Inject('CONFIG_REPOSITORY')
    private configRepository: Repository<Configuracao>,
  ) {}

  async execute(command: GetConfiguracoes) {
    const config = await this.configRepository.findOne()
    this.viewGateway.server.emit('configuracoesAtuais', config);
  }
}
