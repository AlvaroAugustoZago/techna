import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Configuracao } from 'src/domain/configuracao';
import { AntenaGateway } from 'src/infra/antena/events.gateway';
import { ViewGateway } from 'src/ui/events.gateway';
import { Repository } from 'typeorm';
import { StartServer } from './cmd/start-server.cmd';

@CommandHandler(StartServer)
export class StartServerHandler implements ICommandHandler<StartServer> {
  constructor(
    private readonly viewGateway: ViewGateway,
    private readonly antenaGateway: AntenaGateway,
    @Inject('CONFIG_REPOSITORY')
    private repository: Repository<Configuracao>,
  ) {}

  async execute(command: StartServer) {
    const config: Configuracao =  await this.repository.findOne();

    if (command.password == config.password) {
      this.viewGateway.server.emit('authorized', null);
      
      this.antenaGateway.server.emit('start', [
        config.port,
        parseInt(config.dbm),
        config.bip,
        config.seconds,
      ]);
      return;
    }

    this.viewGateway.server.emit('unauthorized', null);
  }
}
