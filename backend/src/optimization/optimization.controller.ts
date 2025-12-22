import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { OptimizationService } from './optimization.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('optimization')
@UseGuards(JwtAuthGuard)
export class OptimizationController {
  constructor(private optimizationService: OptimizationService) {}

  @Post('products/:productId/optimize')
  async optimizeProduct(@Param('productId') productId: string) {
    return this.optimizationService.optimizeProduct(productId);
  }

  @Get('stores/:storeId/optimized-products')
  async getOptimizedProducts(@Param('storeId') storeId: string) {
    return this.optimizationService.getOptimizedProducts(storeId);
  }
}
