import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AntenaGateway } from 'src/infra/antena/events.gateway';
import { StartServer } from './cmd/start-server.cmd';

@CommandHandler(StartServer)
export class StartServerHandler implements ICommandHandler<StartServer> {
  constructor(private readonly antenaGateway: AntenaGateway) {}

  async execute(command: StartServer) {
    console.log(command)
    this.antenaGateway.server.emit('start', [
      command.port,
      parseInt(command.dbm),
      command.bip,
      command.seconds,
    ]);
  }
}
