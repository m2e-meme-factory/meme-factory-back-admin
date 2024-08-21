import { Module } from '@nestjs/common';
import { ProgressProjectService } from './progress-project.service';
import { ProgressProjectController } from './progress-project.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProgressProjectController],
  providers: [ProgressProjectService, PrismaService],
})
export class ProgressProjectModule {}
