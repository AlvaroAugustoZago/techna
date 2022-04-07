import { Module } from '@nestjs/common';
import { InfraModule } from 'src/infra/infra.module';
// import { RfidService } from './rfid.service';

@Module({
  imports: [InfraModule],
  controllers: [],
  // providers: [RfidService],
})
export class ApplicationModule {}
