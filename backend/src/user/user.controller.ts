import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
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

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put('me')
  async updateProfile(@CurrentUser() user: any, @Body() data: any) {
    return this.userService.updateProfile(user.id, data);
  }
}
