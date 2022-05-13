import { Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Configuracao } from 'src/domain/configuracao';
import { Tag } from 'src/domain/tag';
import { GtplanService } from 'src/infra/gtplan/gtplan.service';
import { TagGtplan } from 'src/infra/gtplan/tag';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { PortaFechada } from './cmd/portaFechada.cmd';
import { StopServer } from './cmd/stop-server.cmd';

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
  constructor(
    @Inject('SERVICO_REPOSITORY')
    private repository: Repository<Tag>,
    @Inject('CONFIG_REPOSITORY')
    private configuracaoRepository: Repository<Configuracao>,
    private readonly commandBus: CommandBus,
    private readonly gtplanService: GtplanService,
  ) {}

  async execute(cmd: PortaFechada) {
    console.log("porta-fechada");
    const configuracao: Configuracao =
      await this.configuracaoRepository.findOne();

    sleep(toMs(configuracao.tempoEspera), this.cicloChecagem.bind(configuracao)).then(async () => {
      const minutes = new Date().getTime() - 10 * 60000;
      const saidos = await this.repository.find({
        where: {
          dataUltimaLeitura: LessThan(minutes),
          dataEnvioGtplan: Not(0),
        },
      });

      saidos.forEach((tag) => {
        tag.enviar('S');
        this.gtplanService.send(TagGtplan.of(tag));
        this.repository.save(tag);
      });

      const entrada = await this.repository.find({
        where: {
          dataUltimaLeitura: MoreThan(minutes),
          dataEnvioGtplan: Not(0),
        },
      });

      entrada.forEach((tag) => {
        tag.enviar('E');
        this.gtplanService.send(TagGtplan.of(tag));
        this.repository.save(tag);
      });
    });
    // setTimeout(this.cicloChecagem, toMs(30));
    // Fecho a porta -> espero 30s -> rodo ciclo de checagem -> 2s -> atualiza hora leitura -> se >= 10 e não foi enviado sai
    //                                                                                      -> se ele nao tiver envia como entrada
  }

  async cicloChecagem(configuracao: Configuracao) {

    sleep(toMs(configuracao.tempoChecagem), () =>
      this.commandBus.execute(new StopServer()),
    );
    // setTimeout(() => {
    //   this.commandBus.execute(new StopServer());
    // }, toMs(2));
  }
}
