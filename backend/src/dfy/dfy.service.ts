import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class DfyService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    @InjectQueue('dfy') private dfyQueue: Queue,
  ) {}

  async createProject(tenantId: string, projectData: { projectName: string; niche: string }) {
    const project = await this.prisma.dfyProject.create({
      data: {
        tenantId,
        projectName: projectData.projectName,
        niche: projectData.niche,
        status: 'PLANNING',
      },
    });

    // Queue DFY generation
    await this.dfyQueue.add('generate-store', { projectId: project.id });

    return project;
  }

  async getProjects(tenantId: string) {
    return this.prisma.dfyProject.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProject(projectId: string) {
    return this.prisma.dfyProject.findUnique({
      where: { id: projectId },
    });
  }

  async generateBranding(projectId: string) {
    const project = await this.prisma.dfyProject.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new Error('Project not found');

    const branding = await this.aiService.generateDfyStoreBranding(project.niche);

    return this.prisma.dfyProject.update({
      where: { id: projectId },
      data: {
        brandName: branding.brandName,
        tagline: branding.tagline,
        colorPalette: branding.colorPalette,
        typography: branding.typography,
        brandingComplete: true,
        status: 'GENERATING_PRODUCTS',
      },
    });
  }
}
