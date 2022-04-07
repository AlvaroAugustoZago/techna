import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AntenaModule } from './antena/antena.module';

@Module({
    imports: [AntenaModule, CqrsModule],
    controllers: [],
    providers: [],
    exports: [AntenaModule]
})
export class InfraModule {}
