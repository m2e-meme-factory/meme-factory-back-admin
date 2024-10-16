import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Observer } from 'src/observer/observer.interface'
import { AdminActionLog } from '@prisma/client'

@Injectable()
export class AdminActionLogService implements Observer {
	constructor(private prisma: PrismaService) {}

	async update(action: string, details: any): Promise<void> {
		await this.prisma.adminActionLog.create({
			data: {
				action: details.action,
				entityType: details.entityType,
				entityId: details.entityId,
				oldData: details.oldData,
				newData: details.newData,
				adminId: details.adminId
			}
		})
	}

	async getAll(): Promise<AdminActionLog[]> {
		return await this.prisma.adminActionLog.findMany()
	}
}
