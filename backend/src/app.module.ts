import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import configuration from './config/configuration';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { TenantModule } from './tenant/tenant.module';
import { StoreModule } from './store/store.module';
import { UserModule } from './user/user.module';
import { CrawlerModule } from './crawler/crawler.module';
import { EmailModule } from './email/email.module';
import { SmsModule } from './sms/sms.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { SupportModule } from './support/support.module';
import { OptimizationModule } from './optimization/optimization.module';
import { BillingModule } from './billing/billing.module';
import { DfyModule } from './dfy/dfy.module';
import { AiModule } from './ai/ai.module';
import { IntegrationModule } from './integration/integration.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Scheduling
    ScheduleModule.forRoot(),

    // Bull Queue
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Core Modules
    AuthModule,
    TenantModule,
    StoreModule,
    UserModule,

    // AI Engine
    AiModule,

    // Module 1: Crawler & Analyzer
    CrawlerModule,

    // Module 2: Email & SMS
    EmailModule,
    SmsModule,

    // Module 3: Analytics & Insights
    AnalyticsModule,

    // Module 4: Recommendations
    RecommendationModule,

    // Module 5: Support AI
    SupportModule,

    // Module 6: Optimization
    OptimizationModule,

    // Module 7: Billing
    BillingModule,

    // Module 8: DFY Builder
    DfyModule,

    // Integrations
    IntegrationModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
