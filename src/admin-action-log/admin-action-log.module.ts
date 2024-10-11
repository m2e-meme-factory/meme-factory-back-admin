import { Module } from '@nestjs/common'
import { AdminActionLogService } from './admin-action-log.service'
import { AdminActionLogController } from './admin-action-log.controller'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
	controllers: [AdminActionLogController],
	providers: [AdminActionLogService, PrismaService]
})
export class AdminActionLogModule {}
