import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailService } from './email.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job) {
    const { name, data } = job;
    this.logger.log(`Processing email job: ${name}`);

    switch (name) {
      case 'send-email':
        return this.emailService.sendEmail(data.to, data.subject, data.html);
      default:
        this.logger.warn(`Unknown job type: ${name}`);
    }
  }
}
