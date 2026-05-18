import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { AuthUser } from '../common/types/auth-user.type';

@Controller('stores')
@UseGuards(JwtAuthGuard, TenantGuard)
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post()
  async create(@CurrentUser() user: AuthUser, @Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(user.tenantId, createStoreDto);
  }

  // AUDIT #4: paginated list
  @Get()
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.storeService.findAll(
      user.tenantId,
      Math.max(1, parseInt(page, 10) || 1),
      Math.min(100, Math.max(1, parseInt(limit, 10) || 20)),
    );
  }

  // AUDIT #13: scope every read/write by tenantId
  @Get(':id')
  async findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.storeService.findOneByTenant(user.tenantId, id);
  }

  @Get(':id/analytics')
  async getAnalytics(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.storeService.getAnalyticsByTenant(user.tenantId, id);
  }

  @Put(':id')
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
  ) {
    return this.storeService.updateByTenant(user.tenantId, id, updateStoreDto);
  }

  @Post(':id/sync')
  async sync(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.storeService.syncStoreByTenant(user.tenantId, id);
  }

  @Delete(':id')
  async delete(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.storeService.deleteByTenant(user.tenantId, id);
  }
}
