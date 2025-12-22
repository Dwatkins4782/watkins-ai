import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { DfyService } from './dfy.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('dfy')
@UseGuards(JwtAuthGuard)
export class DfyController {
  constructor(private dfyService: DfyService) {}

  @Post('projects')
  async createProject(@CurrentUser() user: any, @Body() projectData: any) {
    return this.dfyService.createProject(user.tenantId, projectData);
  }

  @Get('projects')
  async getProjects(@CurrentUser() user: any) {
    return this.dfyService.getProjects(user.tenantId);
  }

  @Get('projects/:projectId')
  async getProject(@Param('projectId') projectId: string) {
    return this.dfyService.getProject(projectId);
  }
}
