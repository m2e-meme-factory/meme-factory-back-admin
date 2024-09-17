import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	BadRequestException
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto'
import { Project } from '@prisma/client'
import { FilterProjectDto } from './dto/filter-project.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class ProjectService {
	constructor(private readonly prisma: PrismaService) {}

	async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
		const {
			title,
			description,
			bannerUrl,
			files,
			tags,
			category,
			subtasks,
			authorId
		} = createProjectDto

		try {
			const project = await this.prisma.project.create({
				data: {
					authorId: authorId,
					title,
					description,
					bannerUrl,
					files,
					tags,
					category
				}
			})

			for (const subtask of subtasks) {
				await this.prisma.task.create({
					data: {
						title: subtask.title,
						description: subtask.description,
						price: subtask.price,
						projects: {
							create: {
								projectId: project.id
							}
						}
					}
				})
			}

			return project
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new BadRequestException(
						'Проект с такими данными уже существует.'
					)
				}
			}
			throw new InternalServerErrorException(
				`Ошибка при создании проекта: ${error}`
			)
		}
	}

	async findAll(filterProjectDto: FilterProjectDto) {
		const {
			authorId,
			title,
			description,
			tags,
			category,
			status,
			sortBy = ['id'],
			sortOrder,
			page = 1,
			limit = 10
		} = filterProjectDto

		const where: any = {}

		if (authorId !== undefined) {
			where.authorId = authorId
		}

		if (title) {
			where.title = { contains: title, mode: 'insensitive' }
		}

		if (description) {
			where.description = { contains: description, mode: 'insensitive' }
		}

		if (tags) {
			where.tags = { hasSome: tags }
		}

		if (category) {
			where.category = category
		}

		if (status) {
			where.status = status
		}

		const sortByArray = Array.isArray(sortBy) ? sortBy : [sortBy]
		const sortOrderArray = Array.isArray(sortOrder)
			? sortOrder
			: [sortOrder]

		const orderBy = sortByArray.map((field, index) => ({
			[field]: sortOrderArray[index] || 'asc'
		}))

		try {
			const [projects, total] = await Promise.all([
				this.prisma.project.findMany({
					where,
					orderBy,
					skip: (page - 1) * limit,
					take: limit,
					include: {
						tasks: {
							include: { task: true }
						}
					}
				}),
				this.prisma.project.count({ where })
			])

			return {
				total,
				projects
			}
		} catch (error) {
			throw new InternalServerErrorException(
				'Ошибка при получении проектов.'
			)
		}
	}

	async findOne(id: number) {
		try {
			const project = await this.prisma.project.findUnique({
				where: { id },
				include: {
					tasks: { include: { task: true } }
				}
			})

			if (!project) {
				throw new NotFoundException(`Проект с ID ${id} не найден`)
			}

			return project
		} catch (error) {
			throw new InternalServerErrorException(
				`Ошибка при получении проекта: ${error}`
			)
		}
	}

	async updateProject(
		id: number,
		updateProjectDto: UpdateProjectDto
	): Promise<Project> {
		const {
			title,
			description,
			bannerUrl,
			files,
			tags,
			category,
			subtasks,
			deletedTasks
		} = updateProjectDto

		try {
			const projectExists = await this.prisma.project.findUnique({
				where: { id }
			})

			if (!projectExists) {
				throw new NotFoundException(`Проект с ID ${id} не найден`)
			}

			const project = await this.prisma.project.update({
				where: { id },
				data: {
					title,
					description,
					bannerUrl,
					files,
					tags,
					category
				}
			})

			if (subtasks) {
				for (const subtask of subtasks) {
					if (subtask.id) {
						await this.prisma.task.update({
							where: { id: subtask.id },
							data: {
								title: subtask.title,
								description: subtask.description,
								price: subtask.price
							}
						})
					} else {
						await this.prisma.task.create({
							data: {
								title: subtask.title,
								description: subtask.description,
								price: subtask.price,
								projects: {
									create: {
										projectId: id
									}
								}
							}
						})
					}
				}
			}

			if (deletedTasks && deletedTasks.length > 0) {
				for (const taskId of deletedTasks) {
					const projectTask =
						await this.prisma.projectTask.findUnique({
							where: {
								projectId_taskId: {
									projectId: id,
									taskId: taskId
								}
							}
						})

					if (projectTask) {
						await this.prisma.projectTask.delete({
							where: {
								projectId_taskId: {
									projectId: id,
									taskId: taskId
								}
							}
						})
					} else {
						console.warn(
							`Связь между проектом ${id} и задачей ${taskId} не найдена и не может быть удалена.`
						)
					}
				}
			}

			return project
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error
			}
			throw new InternalServerErrorException(
				`Ошибка при обновлении проекта: ${error}`
			)
		}
	}

	async remove(id: number) {
		try {
			const project = await this.prisma.project.delete({
				where: { id }
			})

			return project
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`Проект с ID ${id} не найден`)
				}
			}
			throw new InternalServerErrorException(
				`Ошибка при удалении проекта: ${error}`
			)
		}
	}
}
