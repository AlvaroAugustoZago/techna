import { HttpModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AntenaModule } from './antena/antena.module';
import { DatabaseModule } from './db/database.module';
import { GtplanService } from './gtplan/gtplan.service';

@Module({
  imports: [DatabaseModule, AntenaModule, CqrsModule, HttpModule],
  exports: [DatabaseModule, AntenaModule, GtplanService],
  providers:[GtplanService],
})
export class InfraModule {}
