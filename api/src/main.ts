import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // REVIEW:
  app.useGlobalPipes(new ValidationPipe());

  // CORS
  const corsOptions = {
    origin: ['http://localhost:5173'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    exposedHeaders: ['Authorization'], // REVIEW:
  };
  app.enableCors(corsOptions);

  // cookie
  app.use(cookieParser());

  await app.listen(3008);
}
bootstrap();
