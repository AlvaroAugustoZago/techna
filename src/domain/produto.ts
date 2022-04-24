import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ default: 0, type: 'varchar' })
  codigo: string;

  @Column({ default: 0, type: 'varchar' })
  nome: string;
}
