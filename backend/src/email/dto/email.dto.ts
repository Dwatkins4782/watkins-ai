import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsObject,
  IsIn,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// AUDIT #26: typed DTOs for email flow + campaign endpoints
export class EmailFlowStepDto {
  @IsString()
  type: string; // 'wait' | 'send' | 'condition'

  @IsOptional()
  @IsNumber()
  @Min(0)
  delayMinutes?: number;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsObject()
  conditions?: Record<string, unknown>;
}

export class CreateEmailFlowDto {
  @IsString()
  name: string;

  @IsString()
  @IsIn(['signup', 'abandoned_cart', 'post_purchase', 'win_back', 'custom'])
  trigger: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailFlowStepDto)
  steps: EmailFlowStepDto[];

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  subject: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  scheduledAt?: string;

  @IsOptional()
  @IsArray()
  segmentIds?: string[];
}
