import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Configuracao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: '/dev/ttyUSB0', type: 'varchar' })
  port: string;

  @Column({ default: 0, type: 'bigint' })
  dbm: string;

  @Column({ default: false, type: 'boolean' })
  bip: boolean;

  @Column({ default: 0, type: 'bigint' })
  seconds: number;

  @Column({ default: '0000', type: 'varchar' })
  password: string;

  @Column({ default: 0, type: 'bigint' })
  tempoChecagem: number;

  @Column({ default: 0, type: 'bigint' })
  tempoEspera: number;

  static of(port: string, dbm: string, bip: boolean, seconds: number, password: string, tempoChecagem: number, tempoEspera: number): Configuracao {
    const config: Configuracao = new Configuracao();
    config.bip = bip;
    config.dbm = dbm;
    config.port = port;
    config.seconds = seconds;
    config.password = password;
    config.tempoChecagem = tempoChecagem;
    config.tempoEspera = tempoEspera;
    return config;
  }
}
