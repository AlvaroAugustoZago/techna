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

  static of(port: string, dbm: string, bip: boolean, seconds: number): Configuracao {
    const config: Configuracao = new Configuracao();
    config.bip = bip;
    config.dbm = dbm;
    config.port = port;
    config.seconds = seconds;
    return config;
  }
}
