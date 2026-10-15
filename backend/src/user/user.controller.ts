import { Controller, Get, Put, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(@CurrentUser() user: any) {
    return this.userService.findAll(user.tenantId);
  }

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.userService.findById(user.id);
  }

  @Get(':id')
  async getUser(@CurrentUser() user: any, @Param('id') id: string) {
    // Only expose users in the caller's own tenant (previously any user by id).
    const target = await this.userService.findById(id);
    if (!target || target.tenant?.id !== user.tenantId) {
      throw new NotFoundException('User not found');
    }
    return target;
  }

  @Put('me')
  async updateProfile(@CurrentUser() user: any, @Body() data: any) {
    return this.userService.updateProfile(user.id, data);
  }
}
