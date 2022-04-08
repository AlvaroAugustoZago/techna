import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AntenaModule } from './antena/antena.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [DatabaseModule, AntenaModule, CqrsModule],
  exports: [DatabaseModule, AntenaModule],
})
export class InfraModule {}
