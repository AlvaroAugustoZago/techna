import { Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Configuracao } from 'src/domain/configuracao';
import { Tag } from 'src/domain/tag';
import { GtplanService } from 'src/infra/gtplan/gtplan.service';
import { TagGtplan } from 'src/infra/gtplan/tag';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { PortaFechada } from './cmd/portaFechada.cmd';
import { StopServer } from './cmd/stop-server.cmd';
import { plainToClass } from 'class-transformer';
import { StartServer } from './cmd/start-server.cmd';
import { AntenaGateway } from 'src/infra/antena/events.gateway';
import { ViewGateway } from 'src/ui/events.gateway';
import { SchedulerRegistry } from '@nestjs/schedule';
import { TasksService } from 'src/ui/antena.service';

function toMs(sec: number) {
  return sec * 1000;
}
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep(time, fn, ...args) {
  await timeout(time);
  return fn(...args);
}

@CommandHandler(PortaFechada)
export class PortaFechadaHandler implements ICommandHandler<PortaFechada> {
  private tagsEstoque: Array<Tag> = [];

  constructor(
    @Inject('SERVICO_REPOSITORY')
    private repository: Repository<Tag>,
    @Inject('CONFIG_REPOSITORY')
    private configuracaoRepository: Repository<Configuracao>,
    private readonly commandBus: CommandBus,
    private readonly gtplanService: GtplanService,
    private readonly antenaGateway: AntenaGateway,
    private readonly viewGateway: ViewGateway,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  async execute(cmd: PortaFechada) {
    
    const configuracao: Configuracao =
      await this.configuracaoRepository.findOne();
    
    this.antenaGateway.server.emit('start', [
      configuracao.port,
      parseInt(configuracao.dbm),
      configuracao.bip,
      configuracao.seconds,
    ]);
    const job = this.schedulerRegistry.getCronJob("timerReader");
    job.start();
  }

}
