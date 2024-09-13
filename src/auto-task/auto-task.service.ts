import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { CreateAutoTaskDto, UpdateAutoTaskDto } from './dto/auto-task.dto'
import { AutoTask, AutoTaskApplication } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { FilterAutoTaskDto } from './dto/fielter-auto-task.dto'

@Injectable()
export class AutoTaskService {
	constructor(private readonly prisma: PrismaService) {}

	async getAutoTaskApplications(
		userId?: number,
		taskId?: number,
		page: number = 1, // Установка значения по умолчанию для страницы
		limit: number = 10 // Установка значения по умолчанию для лимита
	): Promise<{ applications: AutoTaskApplication[]; total: number }> {
		try {
			const whereClause: any = {}

			if (userId) {
				whereClause.userId = userId
			}

			if (taskId) {
				whereClause.taskId = taskId
			}

			// Рассчитываем количество пропускаемых записей
			const skip = (page - 1) * limit;

			const [applications, total] = await Promise.all([
				this.prisma.autoTaskApplication.findMany({
					where: whereClause,
					take: limit, // Ограничение по количеству возвращаемых записей
					skip, // Пропускаем записи на основе текущей страницы
					include: {
						task: true,
						user: true
					}
				}),
				this.prisma.autoTaskApplication.count({
					where: whereClause // Получаем общее количество записей
				})
			]);

			return { applications, total }; // Возвращаем массив записей и общее количество
		} catch (error) {
			throw new InternalServerErrorException(
				`Error fetching auto task applications: ${error}`
			);
		}
	}


	async getAutoTasks(
		filterAutoTaskDto: FilterAutoTaskDto
	): Promise<{ total: number; tasks: AutoTask[] }> {
		try {
			const {
				title,
				description,
				rewardFrom,
				rewardTo,
				url,
				isIntegrated,
				page = 1,
				limit = 10,
				sortBy = ['id'],
				sortOrder = ['asc']
			} = filterAutoTaskDto

			const whereClause: any = {}
			console.log(isIntegrated)
			if (title) {
				whereClause.title = { contains: title, mode: 'insensitive' }
			}

			if (description) {
				whereClause.description = {
					contains: description,
					mode: 'insensitive'
				}
			}

			if (rewardFrom !== undefined) {
				whereClause.reward = {
					...whereClause.reward,
					gte: rewardFrom
				}
			}

			if (rewardTo !== undefined) {
				whereClause.reward = {
					...whereClause.reward,
					lte: rewardTo
				}
			}

			if (url) {
				whereClause.url = { contains: url, mode: 'insensitive' }
			}

			if (isIntegrated !== undefined) {
				whereClause.isIntegrated = isIntegrated
			}

			const sortByArray = Array.isArray(sortBy) ? sortBy : [sortBy]
			const sortOrderArray = Array.isArray(sortOrder)
				? sortOrder
				: [sortOrder]

			const orderBy = sortByArray?.map((field, index) => ({
				[field]: sortOrderArray?.[index] || 'asc'
			}))

			const [total, tasks] = await this.prisma.autoTask
				.findMany({
					where: whereClause,
					take: limit,
					skip: (page - 1) * limit,
					orderBy
				})
				.then(tasks =>
					Promise.all([
						this.prisma.autoTask.count({
							where: whereClause
						}),
						tasks
					])
				)

			return { total, tasks }
		} catch (error) {
			throw new InternalServerErrorException(
				`Error fetching auto tasks: ${error}`
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
