import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AntenaGateway } from 'src/infra/antena/events.gateway';
import { ViewGateway } from 'src/ui/events.gateway';
import { LeituraConcluida } from './cmd/leituraConcluida.cmd';

@CommandHandler(LeituraConcluida)
export class LeituraConcluidaHandler implements ICommandHandler<LeituraConcluida> {
  constructor(private readonly viewGateway: ViewGateway) {}

  async execute(command: LeituraConcluida) {  
    console.log('leitura-concluida') 
    this.viewGateway.server.emit('fechar-loading');
  }
}
