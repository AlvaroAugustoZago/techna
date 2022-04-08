import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { spawn } from 'child_process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');

  await app.listen(3000, () => {
    
  const ls = spawn('python3', ['continuous-read.py']) ;

  });
}
bootstrap();
