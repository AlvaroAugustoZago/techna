import { NestApplication, NestFactory } from '@nestjs/core';
import { spawn } from 'child_process';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');
  
  await app.listen(3000);

  const ls = spawn('python3', ['continuous-read.py']) ;
  
}
bootstrap();
