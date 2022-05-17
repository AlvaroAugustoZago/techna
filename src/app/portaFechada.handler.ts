import { Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Configuracao } from 'src/domain/configuracao';
import { Tag } from 'src/domain/tag';
import { GtplanService } from 'src/infra/gtplan/gtplan.service';
import { TagGtplan } from 'src/infra/gtplan/tag';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { PortaFechada } from './cmd/portaFechada.cmd';
import { StopServer } from './cmd/stop-server.cmd';
import { plainToClass } from 'class-transformer';
import { StartServer } from './cmd/start-server.cmd';
import { AntenaGateway } from 'src/infra/antena/events.gateway';
import { ViewGateway } from 'src/ui/events.gateway';

function toMs(sec: number) {
  return sec * 1000;
}
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep(time, fn, ...args) {
  await timeout(time);
  return fn(...args);
}

@CommandHandler(PortaFechada)
export class PortaFechadaHandler implements ICommandHandler<PortaFechada> {
  private tagsEstoque: Array<Tag> = [];

  constructor(
    @Inject('SERVICO_REPOSITORY')
    private repository: Repository<Tag>,
    @Inject('CONFIG_REPOSITORY')
    private configuracaoRepository: Repository<Configuracao>,
    private readonly commandBus: CommandBus,
    private readonly gtplanService: GtplanService,
    private readonly antenaGateway: AntenaGateway,
    private readonly viewGateway: ViewGateway,
  ) {}

  async execute(cmd: PortaFechada) {
    const configuracao: Configuracao =
      await this.configuracaoRepository.findOne();
    
    this.antenaGateway.server.emit('start', [
      configuracao.port,
      parseInt(configuracao.dbm),
      configuracao.bip,
      configuracao.seconds,
    ]);

    // sleep(toMs(2), async () => {
    //   this.commandBus.execute(new StopServer());
    //   const tags = await this.repository.find();
    //   const tagsSaida = tags.filter((tag: Tag) => {
    //     var delta = Math.abs(Number(tag.dataUltimaLeitura) - new Date().getTime()) / 1000;
    //     var minutes = Math.floor(delta / 60) % 60;
    //     return (minutes >= 2) 
    //   }).map((tag: Tag) => {
    //     tag.enviar('S')
    //     return tag;
    //   });
      
    //   await this.repository.save(tagsSaida)
    //   this.gtplanService.sendMany(tagsSaida.map(TagGtplan.of)).subscribe()

    //   // for (const tag of tags) {
    //   //   var delta = Math.abs(Number(tag.dataUltimaLeitura) - new Date().getTime()) / 1000;
    //   //   var minutes = Math.floor(delta / 60) % 60;
    //   //   if (minutes >= 2) {
    //   //     ;
    //   //     this.gtplanService.send(TagGtplan.of(tag));
    //   //   }
    //   // }
    //   this.viewGateway.server.emit('fechar-loading')
    // })
    // sleep(
    //   toMs(configuracao.tempoEspera),
    //   () => this.cicloChecagem(configuracao),
    // ).then(() => {
    //   sleep(
    //     toMs(60),
    //     () => this.cicloChecagem(configuracao),
    //   ).then(async () => {
        
    //     const allTags = await this.repository
    //     .createQueryBuilder('tag')
    //     .select(['*'])
    //     .where('tag.dataEnvioGtplan is null').getRawMany();

    //     this.tagsEstoque.push(...allTags.map((tag) => plainToClass(Tag, tag)).filter(tag => {
    //       var delta = Math.abs(Number(tag.dataUltimaLeitura) - new Date().getTime()) / 1000;
    //       var minutes = Math.floor(delta / 60) % 60;
    //       return minutes > 0.5;
    //     }).map((tag) => { 
    //       tag.enviar('S');
    //       return tag;
    //     }))

    //     this.tagsEstoque.push(...allTags.map((tag) => plainToClass(Tag, tag)).filter(tag => {
    //       var delta = Math.abs(Number(tag.dataUltimaLeitura) - new Date().getTime()) / 1000;
    //       var minutes = Math.floor(delta / 60) % 60;
    //       return minutes < 0.5;
    //     }).map((tag) => { 
    //       tag.enviar('E');
    //       return tag;
    //     }))

    //     await this.repository.save(this.tagsEstoque);



    //   // const saidos = await this.repository
    //   // .createQueryBuilder('tag')
    //   // .select(['*'])
    //   // .where('tag.dataEnvioGtplan is null')
    //   //   .andWhere(`${dataLimite} > tag.dataUltimaLeitura `)
    //   //   .getRawMany();
      
    //   // this.tagsEstoque.push(
    //   //   ...saidos
    //   //     .map((tag) => plainToClass(Tag, tag))
    //   //     .map((tag) => { 
    //   //       tag.enviar('S');
    //   //       return tag;
    //   //     }),
    //   // );

    //   // const entrada = await this.repository
    //   // .createQueryBuilder('tag')
    //   // .select(['*'])
    //   // .where('tag.dataEnvioGtplan is null')
    //   //   .andWhere(`${dataLimite} < tag.dataUltimaLeitura `)
    //   //   .getRawMany();

    //   // this.tagsEstoque.push(
    //   //   ...entrada
    //   //     .map((tag) => plainToClass(Tag, tag))
    //   //     .map((tag) => {
    //   //       tag.enviar('E');
    //   //       return tag;
    //   //     }),
    //   // );
     
    //   });

    // });
    // Fecho a porta -> espero 30s -> rodo ciclo de checagem -> 2s -> atualiza hora leitura -> se >= 10 e não foi enviado sai
    //                                                                                      -> se ele nao tiver envia como entrada
  }

  async cicloChecagem(configuracao: Configuracao) {
    this.commandBus.execute(new StartServer(configuracao.password, false))
    sleep(toMs(configuracao.tempoChecagem), () =>
      this.commandBus.execute(new StopServer()),
    );
  }
}
