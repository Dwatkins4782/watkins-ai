import { IsString, IsUrl, IsEnum, IsOptional, IsObject } from 'class-validator';

export enum StorePlatform {
  SHOPIFY = 'SHOPIFY',
  WOOCOMMERCE = 'WOOCOMMERCE',
  CUSTOM = 'CUSTOM',
}

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsEnum(StorePlatform)
  platform: StorePlatform;

  @IsOptional()
  @IsString()
  platformApiKey?: string;

  @IsOptional()
  @IsString()
  platformApiSecret?: string;

  @IsOptional()
  @IsString()
  platformShopDomain?: string;

  @IsOptional()
  @IsObject()
  settings?: any;
}

export class UpdateStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsString()
  platformApiKey?: string;

  @IsOptional()
  @IsString()
  platformApiSecret?: string;

  @IsOptional()
  @IsObject()
  settings?: any;
}
