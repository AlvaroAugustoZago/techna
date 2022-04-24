import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { InfraModule } from 'src/infra/infra.module';
import { ViewGateway } from './events.gateway';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [ViewGateway],
  exports: [ViewGateway]
})
export class UiModule {}
