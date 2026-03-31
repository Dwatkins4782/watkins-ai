import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DropshippingService } from './dropshipping.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('dropshipping')
@UseGuards(JwtAuthGuard)
export class DropshippingController {
  constructor(private dropshippingService: DropshippingService) {}

  // ── Suppliers ──

  @Get('suppliers')
  async getSuppliers(
    @Query('category') category?: string,
    @Query('niche') niche?: string,
    @Query('region') region?: string,
  ) {
    return this.dropshippingService.getSuppliers({ category, niche, region });
  }

  @Get('suppliers/:supplierId')
  async getSupplier(@Param('supplierId') supplierId: string) {
    return this.dropshippingService.getSupplier(supplierId);
  }

  @Post('suppliers/seed')
  async seedSuppliers() {
    return this.dropshippingService.seedSuppliers();
  }

  // ── Recommendations ──

  @Get('stores/:storeId/recommendations')
  async getRecommendedSuppliers(@Param('storeId') storeId: string) {
    return this.dropshippingService.getRecommendedSuppliers(storeId);
  }

  // ── Setup Packages ──

  @Get('setup-packages')
  async getSetupPackages() {
    return this.dropshippingService.getSetupPackages();
  }

  // ── Connections ──

  @Post('stores/:storeId/connect')
  async connectSupplier(
    @Param('storeId') storeId: string,
    @Body() data: {
      supplierId: string;
      setupType: 'DIY' | 'ASSISTED' | 'FULL_AUTO';
      apiKey?: string;
      apiSecret?: string;
      markupType?: string;
      markupValue?: number;
      autoImportProducts?: boolean;
      autoFulfillOrders?: boolean;
    },
  ) {
    return this.dropshippingService.connectSupplier(storeId, data);
  }

  @Get('stores/:storeId/connections')
  async getConnections(@Param('storeId') storeId: string) {
    return this.dropshippingService.getConnections(storeId);
  }

  @Get('connections/:connectionId')
  async getConnection(@Param('connectionId') connectionId: string) {
    return this.dropshippingService.getConnection(connectionId);
  }

  @Put('connections/:connectionId/activate')
  async activateConnection(@Param('connectionId') connectionId: string) {
    return this.dropshippingService.activateConnection(connectionId);
  }

  @Put('connections/:connectionId/pause')
  async pauseConnection(@Param('connectionId') connectionId: string) {
    return this.dropshippingService.pauseConnection(connectionId);
  }

  @Put('connections/:connectionId/disconnect')
  async disconnectConnection(@Param('connectionId') connectionId: string) {
    return this.dropshippingService.disconnectConnection(connectionId);
  }
}
