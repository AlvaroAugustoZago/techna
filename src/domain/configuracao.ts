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

  static of(port: string, dbm: string, bip: boolean, seconds: number, password: string): Configuracao {
    const config: Configuracao = new Configuracao();
    config.bip = bip;
    config.dbm = dbm;
    config.port = port;
    config.seconds = seconds;
    config.password = password;
    return config;
  }
}
