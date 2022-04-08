import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryColumn()
  epc: string;

  @Column()
  antena1: number;

  @Column()
  antena2: number;

  @Column()
  antena3: number;

  @Column()
  antena4: number;

  movimentar(horaLeitura: number, antena: number) {
    if (antena === 1) this.antena1 = horaLeitura;
    if (antena === 2) this.antena2 = horaLeitura;
    if (antena === 3) this.antena3 = horaLeitura;
    if (antena === 4) this.antena4 = horaLeitura;
  }

  public static of(epc: string, horaLeitura: number, antena: number): Tag {
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
