import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { Tag } from 'src/domain/tag';
import { DatabaseModule } from 'src/infra/db/database.module';
import { InfraModule } from 'src/infra/infra.module';
import { Connection } from 'typeorm';
import { TasksService } from './antena.service';
import { ViewGateway } from './events.gateway';

@Module({
  imports: [CqrsModule, ScheduleModule.forRoot(),InfraModule   ],
  controllers: [],
  providers: [ViewGateway, TasksService, {
    provide: 'SERVICO_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Tag),
    inject: ['DATABASE_CONNECTION'],
  }],
  exports: [ViewGateway]
})
export class UiModule {}
