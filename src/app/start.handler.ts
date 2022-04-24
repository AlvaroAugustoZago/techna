import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AntenaGateway } from 'src/infra/antena/events.gateway';
import { ViewGateway } from 'src/ui/events.gateway';
import { StartServer } from './cmd/start-server.cmd';

@CommandHandler(StartServer)
export class StartServerHandler implements ICommandHandler<StartServer> {
  constructor(private readonly viewGateway: ViewGateway, private readonly antenaGateway: AntenaGateway) {}

  async execute(command: StartServer) {
    
    if (command.password == '2706') {
      console.log(command.password)
      this.viewGateway.server.emit('authorized', null);
      this.antenaGateway.server.emit('start', [
        command.port,
        parseInt(command.dbm),
        command.bip,
        command.seconds,
      ]);
      return;
    }
    
    this.viewGateway.server.emit('unauthorized', null);

    
  }
}
