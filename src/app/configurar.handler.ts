import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Configuracao } from 'src/domain/configuracao';
import { AntenaGateway } from 'src/infra/antena/events.gateway';
import { Repository } from 'typeorm';
import { Configurar } from './cmd/configurar.cmd';

@CommandHandler(Configurar)
export class ConfigurarHandler implements ICommandHandler<Configurar> {
  constructor(
    private readonly antenaGateway: AntenaGateway,
    @Inject('CONFIG_REPOSITORY')
    private repository: Repository<Configuracao>,
  ) {}

  async execute(command: Configurar) {

    (await this.repository.find()).forEach(config => this.repository.delete(config))
    
    this.repository.save(
      Configuracao.of(command.port, command.dbm, command.bip, command.seconds, command.password, command.tempoChecagem, command.tempoEspera),
    );
  }
}
