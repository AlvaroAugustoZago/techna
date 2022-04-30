import { GtplanService } from './infra/gtplan/gtplan.service';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Connection } from 'typeorm';
import { ApplicationModule } from './app/application.module';
import { LimparHandler } from './app/limpar.handler';
import { StartServerHandler } from './app/start.handler';
import { StopServerHandler } from './app/stop.handler';
import { TagLidaHandler } from './app/tag-lida.handler';
import { Tag } from './domain/tag';
import { InfraModule } from './infra/infra.module';
import { UiModule } from './ui/ui.module';
import { Configuracao } from './domain/configuracao';
import { ConfigurarHandler } from './app/configurar.handler';
import { GetEstoqueHandler } from './app/getEstoque.handler';
import { Produto } from './domain/produto';
import { GetMovimentacoesHandler } from './app/getMovimentacoes.handler';
import { GetConfiguracoesHandler } from './app/getConfiguracoes.handler';
import { PortaFechadaHandler } from './app/portaFechada.handler';

export const CommandHandlers = [
  StartServerHandler,
  StopServerHandler,
  LimparHandler,
  ConfigurarHandler,
  GetEstoqueHandler,
  GetMovimentacoesHandler,
  GetConfiguracoesHandler,
  PortaFechadaHandler
];
export const EventHandlers = [TagLidaHandler];

@Module({
  imports: [InfraModule, UiModule, ApplicationModule, CqrsModule],
  controllers: [],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    {
      provide: 'SERVICO_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(Tag),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'CONFIG_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(Configuracao),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'PRODUTO_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(Produto),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
})
export class AppModule {}
