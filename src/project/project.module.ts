import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminActionLogService } from 'src/admin-action-log/admin-action-log.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, AdminActionLogService],
})
export class ProjectModule {}
