import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryColumn()
  epc: string;

  @Column({default: 0, type: 'bigint'})
  antena1: string;

  @Column( {default: 0, type: 'bigint'})
  antena2: string;

  @Column( {default: 0, type: 'bigint'})
  antena3: string;

  @Column( {default: 0, type: 'bigint'})
  antena4: string;
  
  @Column( {default: false, type: 'boolean'})
  enviado: boolean;

  get produto(): string {
    return this.epc.substring(0, 8)
  }

  get lote(): string {
    return this.epc.substring(9,12)
  }

  get antena(): string {
    return "2";
  }

  get movimento(): string {
    return "E";
  }

  movimentar(horaLeitura: string, antena: number) {
    if (antena === 1) this.antena1 = horaLeitura;
    if (antena === 2) this.antena2 = horaLeitura;
    if (antena === 3) this.antena3 = horaLeitura;
    if (antena === 4) this.antena4 = horaLeitura;
  }

  public static of(epc: string, horaLeitura: string, antena: number): Tag {
    const tag: Tag = new Tag();

    tag.epc = epc;
    if (antena === 1) tag.antena1 = horaLeitura;
    if (antena === 2) tag.antena2 = horaLeitura;
    if (antena === 3) tag.antena3 = horaLeitura;
    if (antena === 4) tag.antena4 = horaLeitura;

    //TODO: Rodar logica de entrada e saida;
    return tag;
  }
}
