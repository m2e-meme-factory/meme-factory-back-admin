import { Module } from '@nestjs/common';
import { AutoTaskService } from './auto-task.service';
import { AutoTaskController } from './auto-task.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminActionLogService } from 'src/admin-action-log/admin-action-log.service';

@Module({
  controllers: [AutoTaskController],
  providers: [AutoTaskService, PrismaService, AdminActionLogService],
})
export class AutoTaskModule {}
