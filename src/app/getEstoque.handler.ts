import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Produto } from 'src/domain/produto';
import { Tag } from 'src/domain/tag';
import { ViewGateway } from 'src/ui/events.gateway';
import { Not, Repository } from 'typeorm';
import { GetEstoque } from './cmd/getEstoque.cmd';

@CommandHandler(GetEstoque)
export class GetEstoqueHandler implements ICommandHandler<GetEstoque> {
  constructor(
    private readonly viewGateway: ViewGateway,
    @Inject('SERVICO_REPOSITORY')
    private repository: Repository<Tag>,

    @Inject('PRODUTO_REPOSITORY')
    private produtoRepository: Repository<Produto>,
  ) {}

  async execute(command: GetEstoque) {
    const estoque = await this.repository 
      .createQueryBuilder('tag')
      .select(['SUBSTRING(epc, 13, 17) as codigo', 'count(SUBSTRING(epc, 13, 17)) as count'])
      .where("movimento != 'S'")
      .groupBy('SUBSTRING(epc, 13, 15) ')
      .getRawMany();

    const itens: Array<{ codigo: string; quantidade: number }> =
      [];

    for (const item of estoque) {      
      itens.push({ codigo: item.codigo, quantidade: item.count });
    }


    this.viewGateway.server.emit('estoqueAtual', itens);
  }
}
