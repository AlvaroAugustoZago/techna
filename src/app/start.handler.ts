import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Configuracao } from 'src/domain/configuracao';
import { AntenaGateway } from 'src/infra/antena/events.gateway';
import { ViewGateway } from 'src/ui/events.gateway';
import { Repository } from 'typeorm';
import { StartServer } from './cmd/start-server.cmd';

@CommandHandler(StartServer)
export class StartServerHandler implements ICommandHandler<StartServer> {
  constructor(
    private readonly viewGateway: ViewGateway,
    @Inject('CONFIG_REPOSITORY')
    private repository: Repository<Configuracao>,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  async execute(command: StartServer) {
    const job = this.schedulerRegistry.getCronJob("timerReader");
    job.stop();

    const config: Configuracao =  await this.repository.findOne();

    if (command.password == config.password) {
      if (command.isUI) this.viewGateway.server.emit('authorized', null);
      
      return;
    }

    this.viewGateway.server.emit('unauthorized', null);
  }
}
