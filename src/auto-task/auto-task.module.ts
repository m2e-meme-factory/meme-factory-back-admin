import { Module } from '@nestjs/common';
import { AutoTaskService } from './auto-task.service';
import { AutoTaskController } from './auto-task.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AutoTaskController],
  providers: [AutoTaskService, PrismaService],
})
export class AutoTaskModule {}
