import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DfyService } from './dfy.service';

@Processor('dfy')
export class DfyProcessor extends WorkerHost {
  private readonly logger = new Logger(DfyProcessor.name);

  constructor(private dfyService: DfyService) {
    super();
  }

  async process(job: Job) {
    const { name, data } = job;
    this.logger.log(`Processing DFY job: ${name}`);

    switch (name) {
      case 'generate-store':
        return this.dfyService.generateBranding(data.projectId);
      default:
        this.logger.warn(`Unknown job type: ${name}`);
    }
  }
}
