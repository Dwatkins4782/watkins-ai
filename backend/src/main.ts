console.log('=== main.ts loaded ===', new Date().toISOString());

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  console.log('=== bootstrap() starting ===');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    rawBody: true,
  });

  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService.get('FRONTEND_URL') || 'http://localhost:3000',
    credentials: true,
  });

  // Compression
  app.use(compression());

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validate critical env vars in production
  if (process.env.NODE_ENV === 'production') {
    const jwtSecret = configService.get('jwt.secret');
    if (!jwtSecret || jwtSecret === 'your-secret-key-change-in-production' || jwtSecret === 'change-me-in-production-use-a-strong-random-string') {
      console.error('FATAL: JWT_SECRET must be set to a strong value in production');
      process.exit(1);
    }
    if (!configService.get('database.url')) {
      console.error('FATAL: DATABASE_URL must be set in production');
      process.exit(1);
    }
  }

  const port = process.env.PORT || configService.get('port') || 4000;
  console.log(`=== Binding to 0.0.0.0:${port} ===`);
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Watkins AI Backend running on port ${port}`);
  console.log(`📊 API: /api/v1`);
  console.log(`❤️  Health: /api/v1/health`);
}

bootstrap().catch((err) => {
  console.error('❌ Bootstrap failed:', err);
  process.exit(1);
});
