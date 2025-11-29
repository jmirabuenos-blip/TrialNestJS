// Bootstrap NestJS app: load env, enable CORS, start server
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule); 
  const port = process.env.PORT || 5000;
  app.enableCors();
  await app.listen(+port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}

bootstrap();