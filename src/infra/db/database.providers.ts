import { Configuracao } from 'src/domain/configuracao';
import { Tag } from 'src/domain/tag';
import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>    
      await createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'techna',
        insecureAuth: true,
        entities: [Tag, Configuracao],//__dirname + '/../domain/*{.ts,.js}'
        migrationsTableName: 'custom_migration_table',
        migrations: ['migration/*.js'],
        cli: { migrationsDir: 'migration' },
        synchronize: true,
      }),
  },
];
