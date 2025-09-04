import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function parseOrigins(): (string | RegExp)[] {
  //Railway :
  // https://bx-dev-interview-challenge.vercel.app,http://localhost:3001,http://localhost:3000
  const env = process.env.CORS_ORIGINS;
  const base = [
    /\.vercel\.app$/,
    'http://localhost:3001',
    'http://localhost:3000',
  ];
  if (!env) return base;
  return [
    ...base,
    ...env
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  ];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const allowList = parseOrigins();

  app.enableCors({
    origin(
      origin: string | undefined,
      cb: (err: Error | null, allow?: boolean) => void,
    ) {
      if (!origin) return cb(null, true);
      const ok = allowList.some((rule) =>
        typeof rule === 'string' ? rule === origin : rule.test(origin),
      );
      return ok
        ? cb(null, true)
        : cb(new Error(`CORS: ${origin} not allowed`), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['ETag'],
    credentials: false,
    optionsSuccessStatus: 204,
  });

  const port = Number(process.env.PORT || 3000);
  await app.listen(port, '0.0.0.0');
}
bootstrap();
