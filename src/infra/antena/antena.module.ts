import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from '../../ui/antena.service';
import { AntenaGateway } from './events.gateway';

@Module({
    imports: [CqrsModule],
    controllers: [],
    providers: [AntenaGateway],
    exports:[AntenaGateway]
})
export class AntenaModule {}
