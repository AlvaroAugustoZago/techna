
import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, Interval } from '@nestjs/schedule';
import { PortaFechada } from 'src/app/cmd/portaFechada.cmd';
import { StopServer } from 'src/app/cmd/stop-server.cmd';
import { Tag } from 'src/domain/tag';
import { GtplanService } from 'src/infra/gtplan/gtplan.service';
import { TagGtplan } from 'src/infra/gtplan/tag';
import { IsNull, Repository } from 'typeorm';
import { ViewGateway } from './events.gateway';

@Injectable()
export class TasksService {
    constructor(private readonly commandBus: CommandBus,
        private readonly viewGateway: ViewGateway,
        @Inject('SERVICO_REPOSITORY')
        private repository: Repository<Tag>,
        private readonly gtplanService: GtplanService,) {}

    // @Interval("timerReader",60000)
    @Cron('* * * * *', {
        name: 'timerReader',
      })
    startRead() {
        console.log('Starting Read');
        this.commandBus.execute(new PortaFechada());
        setTimeout(() => {
            this.commandBus.execute(new StopServer());
            console.log('Stop Read');

            const isSaida = (tag: Tag) => {
                var delta = Math.abs(Number(tag.dataUltimaLeitura) - new Date().getTime()) / 1000;
                var minutes = Math.floor(delta / 60) % 60;
                console.log(tag.epc, minutes)
                return (minutes >= 3)
            }
            this.repository.find().then(allTags => {
                for (var tag of allTags) {
                    if (isSaida(tag)){
                        tag.movimentar();
                        tag.enviar('S', true);
                        this.repository.save(tag);
                        this.gtplanService.send(TagGtplan.of(tag));
                    }
                }           
            });
        }, 20000);
    }
}