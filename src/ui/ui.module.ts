import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ViewGateway } from './events.gateway';
import { UiController } from './ui.controller';

@Module({
  imports: [CqrsModule],
  controllers: [UiController],
  providers: [ViewGateway],
  exports: [ViewGateway]
})
export class UiModule {}
