import { Module } from '@nestjs/common';
import { ProgressProjectService } from './progress-project.service';
import { ProgressProjectController } from './progress-project.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminActionLogService } from 'src/admin-action-log/admin-action-log.service';

@Module({
  controllers: [ProgressProjectController],
  providers: [ProgressProjectService, PrismaService, AdminActionLogService],
})
export class ProgressProjectModule {}
