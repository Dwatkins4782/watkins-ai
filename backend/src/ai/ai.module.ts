import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [AiService, PrismaService],
  exports: [AiService],
})
export class AiModule {}
