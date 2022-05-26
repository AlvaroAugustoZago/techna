import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Log } from "src/domain/log";
import { Repository } from "typeorm";
import { PortaAberta } from "./cmd/portaAberta.cmd";

@CommandHandler(PortaAberta)
export class PortaAbertaHandler implements ICommandHandler<PortaAberta> {
    constructor(
        @Inject('LOG_REPOSITORY')
        private repository: Repository<Log>,
    ) {    }

    execute(command: PortaAberta): Promise<any> {
        return this.repository.save(Log.novo());    
    }
}