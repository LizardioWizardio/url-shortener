import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      trustProxy: true,
    }),
  );

  const configService = app.get(ConfigService);

  // Security
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  // Compression
  await app.register(compress);

  // CORS
  app.enableCors({
    origin: configService.get('app.allowedOrigins'),
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Start
  const port = configService.get('port');
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 API running on: http://localhost:${port}`);
}

bootstrap();