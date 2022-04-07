import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from './app/application.module';
import { LimparHandler } from './app/limpar.handler';
import { StartServerHandler } from './app/start.handler';
import { StopServerHandler } from './app/stop.handler';
import { TagLidaHandler } from './app/tag-lida.handler';
import { InfraModule } from './infra/infra.module';
import { UiModule } from './ui/ui.module';

export const CommandHandlers = [StartServerHandler, StopServerHandler, LimparHandler];
export const EventHandlers =  [TagLidaHandler];

@Module({
  imports: [InfraModule, UiModule,ApplicationModule, CqrsModule],
  controllers: [],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
  ]
})
export class AppModule {}
