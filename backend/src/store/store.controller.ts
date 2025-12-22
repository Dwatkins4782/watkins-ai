import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/store.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('stores')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(user.tenantId, createStoreDto);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.storeService.findAll(user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Get(':id/analytics')
  async getAnalytics(@Param('id') id: string) {
    return this.storeService.getAnalytics(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Post(':id/sync')
  async sync(@Param('id') id: string) {
    return this.storeService.syncStore(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.storeService.delete(id);
  }
}
