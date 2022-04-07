import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AntenaGateway } from './events.gateway';

@Module({
    imports: [CqrsModule],
    controllers: [],
    providers: [AntenaGateway],
    exports:[AntenaGateway]
})
export class AntenaModule {}
