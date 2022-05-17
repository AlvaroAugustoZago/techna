import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AntenaGateway } from 'src/infra/antena/events.gateway';
import { StopServer } from './cmd/stop-server.cmd';

@CommandHandler(StopServer)
export class StopServerHandler implements ICommandHandler<StopServer> {
  constructor(private readonly antenaGateway: AntenaGateway) {}

  async execute(command: StopServer) {
    this.antenaGateway.server.emit('stop', null);
  }
}
