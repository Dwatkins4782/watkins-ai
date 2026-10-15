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

  // CORS: allow the production site(s) plus any origins supplied via
  // FRONTEND_URL (comma-separated). Trailing slashes are normalized so an env
  // value like "https://ecomrevhub.com/" still matches the browser Origin
  // header. Previously this was a single exact-match string that defaulted to
  // localhost:3000, which blocked every request from the deployed frontend
  // whenever FRONTEND_URL was unset or mismatched ("Failed to load stores").
  const normalizeOrigin = (o: string) => o.trim().replace(/\/+$/, '');
  const configuredOrigins = String(configService.get('FRONTEND_URL') || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);
  const allowedOrigins = Array.from(
    new Set([
      'https://ecomrevhub.com',
      'https://www.ecomrevhub.com',
      'http://localhost:3000',
      ...configuredOrigins,
    ]),
  );
  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser clients (no Origin header, e.g. Stripe webhooks,
      // health checks) and allow-listed origins. Others get no CORS headers.
      callback(null, !origin || allowedOrigins.includes(normalizeOrigin(origin)));
    },
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
    // Reject missing, too-short, or obvious placeholder secrets (anything
    // copied from .env.example) instead of matching two exact strings.
    const looksWeak =
      !jwtSecret ||
      jwtSecret.length < 32 ||
      /change|secret-key|your-|example|placeholder|replace/i.test(jwtSecret);
    if (looksWeak) {
      console.error(
        'FATAL: JWT_SECRET must be a strong random string (>=32 chars, not a placeholder) in production',
      );
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
