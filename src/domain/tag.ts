import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryColumn()
  epc: string;

  @Column({default: 0, type: 'bigint'})
  dataCriacao: string;

  @Column( {default: 0, type: 'bigint'})
  dataUltimaLeitura: string;

  @Column( {default: null, type: 'bigint'})
  dataEnvioGtplan: string;

  @Column( {default: '', type: 'varchar'})
  movimento: string;

  get produto(): string {
    return this.epc.substring(0, 8)
  }

  get lote(): string {
    return this.epc.substring(9,12)
  }

  get antena(): string {
    return "2";
  }

  movimentar() {
    this.dataUltimaLeitura = new Date().getTime().toString();
  }
  enviar(movimento: string) { 
    this.movimento = movimento;
    this.dataEnvioGtplan = new Date().getTime().toString();
  }
  public static of(epc: string): Tag {
    const tag: Tag = new Tag();

    tag.epc = epc;
    tag.dataCriacao = new Date().getTime().toString();
    
    return tag;
  }
}
