import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function parseOrigins(v?: string): (string | RegExp)[] {
  if (!v) return ['http://localhost:3001', 'http://localhost:3000'];
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const origins = parseOrigins(process.env.CORS_ORIGINS);
  app.enableCors({
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['ETag'],
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
