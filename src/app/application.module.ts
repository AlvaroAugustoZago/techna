import { Module } from '@nestjs/common';
import { TasksService } from 'src/ui/antena.service';
import { InfraModule } from '../infra/infra.module';

@Module({
  imports: [InfraModule],
  controllers: [],
  providers:[]
})
export class ApplicationModule {}
