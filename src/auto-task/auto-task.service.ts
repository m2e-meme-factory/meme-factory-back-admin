import {
	Injectable,
	InternalServerErrorException,
	BadRequestException,
	NotFoundException,
	ConflictException
} from '@nestjs/common'
import { CreateAutoTaskDto, UpdateAutoTaskDto } from './dto/auto-task.dto'
import { AutoTask, AutoTaskApplication, Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { FilterAutoTaskDto } from './dto/fielter-auto-task.dto'

@Injectable()
export class AutoTaskService {
	constructor(private readonly prisma: PrismaService) {}

	async getAutoTaskApplications(
		userId?: number,
		taskId?: number,
		page: number = 1,
		limit: number = 10
	): Promise<{ applications: AutoTaskApplication[]; total: number }> {
		try {
			const whereClause: any = {}

			if (userId) {
				if (typeof userId !== 'number') {
					throw new BadRequestException('userId должен быть числом.')
				}
				whereClause.userId = userId
			}

			if (taskId) {
				if (typeof taskId !== 'number') {
					throw new BadRequestException('taskId должен быть числом.')
				}
				whereClause.taskId = taskId
			}

			const skip = (page - 1) * limit

			const [applications, total] = await Promise.all([
				this.prisma.autoTaskApplication.findMany({
					where: whereClause,
					take: limit,
					skip,
					include: {
						task: true,
						user: true
					}
				}),
				this.prisma.autoTaskApplication.count({
					where: whereClause
				})
			])

			return { applications, total }
		} catch (error) {
			throw new InternalServerErrorException(
				`Error fetching auto task applications: ${error.message}`
			)
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
				if (typeof rewardFrom !== 'number') {
					throw new BadRequestException(
						'rewardFrom должен быть числом.'
					)
				}
				whereClause.reward = { ...whereClause.reward, gte: rewardFrom }
			}

			if (rewardTo !== undefined) {
				if (typeof rewardTo !== 'number') {
					throw new BadRequestException(
						'rewardTo должен быть числом.'
					)
				}
				whereClause.reward = { ...whereClause.reward, lte: rewardTo }
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

			const orderBy = sortByArray.map((field, index) => ({
				[field]: sortOrderArray[index] || 'asc'
			}))

			const [total, tasks] = await Promise.all([
				this.prisma.autoTask.count({ where: whereClause }),
				this.prisma.autoTask.findMany({
					where: whereClause,
					take: limit,
					skip: (page - 1) * limit,
					orderBy
				})
			])

			return { total, tasks }
		} catch (error) {
			throw new InternalServerErrorException(
				`Error fetching auto tasks: ${error.message}`
			)
		}
	}

	async createTask(dto: CreateAutoTaskDto): Promise<AutoTask> {
		try {
			const { title, description, reward, url, isIntegrated } = dto

			if (!title || !description || reward === undefined) {
				throw new BadRequestException(
					'Title, description и reward обязательны.'
				)
			}

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
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002'
			) {
				throw new ConflictException(
					'AutoTask с таким уникальным значением уже существует.'
				)
			}
			throw new InternalServerErrorException(
				`Error creating task: ${error.message}`
			)
		}
	}

	async updateTask(
		taskId: number,
		dto: UpdateAutoTaskDto
	): Promise<AutoTask> {
		try {
			const { title, description, reward, url, isIntegrated } = dto

			if (typeof taskId !== 'number') {
				throw new BadRequestException('taskId должен быть числом.')
			}

			const existingTask = await this.prisma.autoTask.findUnique({
				where: { id: taskId }
			})
			if (!existingTask) {
				throw new NotFoundException(
					`AutoTask с ID ${taskId} не найден.`
				)
			}

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
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002'
			) {
				throw new ConflictException(
					'AutoTask с таким уникальным значением уже существует.'
				)
			}
			throw new InternalServerErrorException(
				`Error updating task: ${error.message}`
			)
		}
	}
}
