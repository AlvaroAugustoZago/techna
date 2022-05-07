import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Produto } from 'src/domain/produto';
import { Tag } from 'src/domain/tag';
import { ViewGateway } from 'src/ui/events.gateway';
import { Repository } from 'typeorm';
import { GetMovimentacoes } from './cmd/getMovimentacoes.cmd';

@CommandHandler(GetMovimentacoes)
export class GetMovimentacoesHandler
  implements ICommandHandler<GetMovimentacoes>
{
  constructor(
    private readonly viewGateway: ViewGateway,
    @Inject('SERVICO_REPOSITORY')
    private repository: Repository<Tag>,

    @Inject('PRODUTO_REPOSITORY')
    private produtoRepository: Repository<Produto>,
  ) {}

  async execute(command: GetMovimentacoes) {
    const tags = await this.repository.find();
    const itens: Array<{ codigo: string; nome?: string; enviado: boolean; movimento: string }> = [];
    for (const tag of tags) {
      const codigo: string = tag.epc.substring(13, 17);
      
      // const produto = await this.produtoRepository.find({
      //   where: { codigo },
      // });

      itens.push({ codigo: tag.epc, enviado: tag.dataEnvioGtplan != "0", movimento: tag.movimento });
    }

    this.viewGateway.server.emit('movimentacoesAtuais', itens);
  }
}
