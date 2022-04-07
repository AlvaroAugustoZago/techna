import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AntenaGateway } from 'src/infra/antena/events.gateway';
import { Limpar } from './cmd/limar.cmd';

@CommandHandler(Limpar)
export class LimparHandler implements ICommandHandler<Limpar> {
  constructor(private readonly antenaGateway: AntenaGateway) {}

  async execute(command: Limpar) {
    console.log('limpar')
    this.antenaGateway.server.emit('limpar');
  }
}
