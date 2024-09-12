import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateAutoTaskDto, UpdateAutoTaskDto } from './dto/auto-task.dto'
import { AutoTask, AutoTaskApplication } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AutoTaskService {
	constructor(private readonly prisma: PrismaService) {}

	async getAutoTaskApplications(
		userId?: number,
		taskId?: number
	): Promise<AutoTaskApplication[]> {
		try {
			const whereClause: any = {}

			if (userId) {
				whereClause.userId = userId
			}

			if (taskId) {
				whereClause.taskId = taskId
			}

			const applications = await this.prisma.autoTaskApplication.findMany(
				{
					where: whereClause,
					include: {
						task: true,
						user: true
					}
				}
			)

			return applications
		} catch (error) {
			throw new InternalServerErrorException(
				`Error fetching auto task applications: ${error}`
			)
		}
	}

	async createTask(dto: CreateAutoTaskDto): Promise<AutoTask> {
		try {
			const { title, description, reward, url, isIntegrated } = dto

			const task = await this.prisma.autoTask.create({
				data: {
					title,
					description,
					reward,
					url,
					isIntegrated
				}
			})
			return task
		} catch (error) {
			throw new InternalServerErrorException(
				`Error creating task: ${error}`
			)
		}
	}

	async updateTask(
		taskId: number,
		dto: UpdateAutoTaskDto
	): Promise<AutoTask> {
		try {
			const { title, description, reward, url, isIntegrated } = dto

			const task = await this.prisma.autoTask.update({
				where: { id: taskId },
				data: {
					title,
					description,
					reward,
					url,
					isIntegrated
				}
			})
			return task
		} catch (error) {
			throw new InternalServerErrorException(
				`Error creating task: ${error}`
			)
		}
	}
}
