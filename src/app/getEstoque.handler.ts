import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Produto } from 'src/domain/produto';
import { Tag } from 'src/domain/tag';
import { ViewGateway } from 'src/ui/events.gateway';
import { Repository } from 'typeorm';
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
    const estoque = await this.repository.find();
    const itens: Array<{ codigo: string; nome: string; quantidade: number }> =
      [];
    for (const item of estoque) {
      const codigo: string = item.epc.substring(13, 17);
      if (itens.some((item) => item.codigo === codigo)) return;
      const produto = await this.produtoRepository.find({
        where: { codigo },
      });
      itens.push({ codigo, nome: produto[0].nome, quantidade: produto.length });
    }


    this.viewGateway.server.emit('estoqueAtual', itens);
  }
}
