import {
	Injectable,
	NotFoundException,
	InternalServerErrorException,
	BadRequestException,
	ConflictException
} from '@nestjs/common'
import { ProgressProject, Prisma } from '@prisma/client'
import { UpdateProgressProjectDto } from './dto/progress-project.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { FilterProgressProjectDto } from './dto/filter-progress-project.dto'
import { Observer } from 'src/observer/observer.interface'
import { AdminActionLogService } from 'src/admin-action-log/admin-action-log.service'

@Injectable()
export class ProgressProjectService {
	private observers: Observer[] = []

	constructor(
		private readonly prisma: PrismaService,
		private readonly adminActionLogService: AdminActionLogService
	) {
		this.attach(adminActionLogService)
	}

	attach(observer: Observer): void {
		this.observers.push(observer)
	}

	detach(observer: Observer): void {
		const index = this.observers.indexOf(observer)
		if (index > -1) {
			this.observers.splice(index, 1)
		}
	}

	notify(action: string, details: any): void {
		for (const observer of this.observers) {
			observer.update(action, details)
		}
	}

	private validateCreateData(data: any) {
		if (!data.projectId || !data.userId) {
			throw new BadRequestException(
				'projectId и userId обязательны для создания прогресса проекта.'
			)
		}
		if (typeof data.status !== 'string') {
			throw new BadRequestException(
				'Некорректный тип данных для статуса.'
			)
		}
	}

	async create(data, adminId: number): Promise<ProgressProject> {
		this.validateCreateData(data)

		try {
			const projectExists = await this.prisma.project.findUnique({
				where: { id: data.projectId }
			})
			const userExists = await this.prisma.user.findUnique({
				where: { id: data.userId }
			})
			if (!projectExists) {
				throw new NotFoundException(
					`Проект с ID ${data.projectId} не найден.`
				)
			}
			if (!userExists) {
				throw new NotFoundException(
					`Пользователь с ID ${data.userId} не найден.`
				)
			}

			const newProgressProject = await this.prisma.progressProject.create({
				data
			})

			this.notify('create', {
				action: 'CREATE_PROGRESS_PROJECT',
				entityType: 'ProgressProject',
				entityId: newProgressProject.id,
				newData: newProgressProject,
				adminId
			})

			return newProgressProject
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ConflictException(
						'Прогресс проекта с такими данными уже существует.'
					)
				}
			}
			throw new InternalServerErrorException(
				'Ошибка при создании прогресса проекта.'
			)
		}
	}

	async findAll(
		filterDto: FilterProgressProjectDto
	): Promise<{ total: number; progressProjects: ProgressProject[] }> {
		const {
			userId,
			projectId,
			status,
			page = 1,
			limit = 10,
			sortBy = ['id'],
			sortOrder = ['asc']
		} = filterDto

		const whereClause: any = {}

		if (userId !== undefined) {
			whereClause.userId = userId
		}

		if (projectId !== undefined) {
			whereClause.projectId = projectId
		}

		if (status !== undefined) {
			if (typeof status !== 'string') {
				throw new BadRequestException('Статус должен быть строкой.')
			}
			whereClause.status = status
		}

		const sortByArray = Array.isArray(sortBy) ? sortBy : [sortBy]
		const sortOrderArray = Array.isArray(sortOrder)
			? sortOrder
			: [sortOrder]

		const orderBy = sortByArray.map((field, index) => ({
			[field]: sortOrderArray[index] || 'asc'
		}))

		try {
			const [total, progressProjects] = await this.prisma.progressProject
				.findMany({
					where: whereClause,
					include: { events: true },
					take: limit,
					skip: (page - 1) * limit,
					orderBy
				})
				.then(projects =>
					Promise.all([
						this.prisma.progressProject.count({
							where: whereClause
						}),
						projects
					])
				)

			return { total, progressProjects }
		} catch (error) {
			throw new InternalServerErrorException(
				'Ошибка при получении прогресса проекта.'
			)
		}
	}

	async findOne(id: number): Promise<ProgressProject> {
		if (typeof id !== 'number' || isNaN(id)) {
			throw new BadRequestException('ID должен быть числом.')
		}

		try {
			const progressProject =
				await this.prisma.progressProject.findUnique({
					where: { id },
					include: { events: true }
				})

			if (!progressProject) {
				throw new NotFoundException(
					`Прогресс проекта с ID ${id} не найден`
				)
			}

			return progressProject
		} catch (error) {
			throw new InternalServerErrorException(
				`Ошибка при получении прогресса проекта: ${error}`
			)
		}
	}

	async update(
		id: number,
		data: UpdateProgressProjectDto,
		adminId: number
	): Promise<ProgressProject> {
		if (typeof id !== 'number' || isNaN(id)) {
			throw new BadRequestException('ID должен быть числом.')
		}

		try {
			const oldProgressProject = await this.prisma.progressProject.findUnique({
				where: { id }
			})

			if (!oldProgressProject) {
				throw new NotFoundException(
					`Прогресс проекта с ID ${id} не найден`
				)
			}

			const updatedProgressProject = await this.prisma.progressProject.update({
				where: { id },
				data
			})

			this.notify('update', {
				action: 'UPDATE_PROGRESS_PROJECT',
				entityType: 'ProgressProject',
				entityId: updatedProgressProject.id,
				oldData: oldProgressProject,
				newData: updatedProgressProject,
				adminId
			})

			return updatedProgressProject
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error
			}
			throw new InternalServerErrorException(
				`Ошибка при обновлении прогресса проекта: ${error}`
			)
		}
	}

	async remove(id: number, adminId: number): Promise<ProgressProject> {
		if (typeof id !== 'number' || isNaN(id)) {
			throw new BadRequestException('ID должен быть числом.')
		}

		try {
			const progressProjectToDelete = await this.prisma.progressProject.findUnique({
				where: { id }
			})

			if (!progressProjectToDelete) {
				throw new NotFoundException(
					`Прогресс проекта с ID ${id} не найден`
				)
			}

			const deletedProgressProject = await this.prisma.progressProject.delete({
				where: { id }
			})

			this.notify('delete', {
				action: 'DELETE_PROGRESS_PROJECT',
				entityType: 'ProgressProject',
				entityId: deletedProgressProject.id,
				oldData: progressProjectToDelete,
				newData: null,
				adminId
			})

			return deletedProgressProject
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(
						`Прогресс проекта с ID ${id} не найден`
					)
				}
			}
			throw new InternalServerErrorException(
				`Ошибка при удалении прогресса проекта: ${error}`
			)
		}
	}
}
