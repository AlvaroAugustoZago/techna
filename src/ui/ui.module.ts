import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ViewGateway } from './events.gateway';

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [ViewGateway],
  exports: [ViewGateway]
})
export class UiModule {}
