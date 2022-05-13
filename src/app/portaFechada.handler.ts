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
  ) {}

  async execute(cmd: PortaFechada) {
    const configuracao: Configuracao =
      await this.configuracaoRepository.findOne();

    sleep(
      toMs(configuracao.tempoEspera),
      () => this.cicloChecagem(configuracao),
    ).then(async () => {
      const minutes = new Date().getTime() - 10 * 60000;
      const baseQuery = await this.repository
        .createQueryBuilder('tag')
        .select(['*'])
        .where('tag.dataEnvioGtplan is null');

      const saidos = await baseQuery
        .andWhere(`tag.dataUltimaLeitura < ${minutes}`)
        .getRawMany();

      this.tagsEstoque.push(
        ...saidos
          .map((tag) => plainToClass(Tag, tag))
          .map((tag) => {
            tag.enviar('S');
            return tag;
          }),
      );

      const entrada = await baseQuery
        .andWhere(`tag.dataUltimaLeitura > ${minutes}`)
        .getRawMany();

      this.tagsEstoque.push(
        ...entrada
          .map((tag) => plainToClass(Tag, tag))
          .map((tag) => {
            tag.enviar('E');
            return tag;
          }),
      );
      await this.repository.save(this.tagsEstoque);

      this.gtplanService
        .sendMany(this.tagsEstoque.map((tag) => TagGtplan.of(tag)))
        .subscribe();
    });
    // setTimeout(this.cicloChecagem, toMs(30));
    // Fecho a porta -> espero 30s -> rodo ciclo de checagem -> 2s -> atualiza hora leitura -> se >= 10 e não foi enviado sai
    //                                                                                      -> se ele nao tiver envia como entrada
  }

  async cicloChecagem({tempoChecagem}: Configuracao) {
    sleep(toMs(tempoChecagem), () =>
      this.commandBus.execute(new StopServer()),
    );
    // setTimeout(() => {
    //   this.commandBus.execute(new StopServer());
    // }, toMs(2));
  }
}
