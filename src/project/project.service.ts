import {
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto'
import { Project } from '@prisma/client'

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
			// const { minPrice, maxPrice } = countProjectPrice(subtasks)
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
			throw new InternalServerErrorException(
				`Ошибка при создании проекта: ${error}`
			)
		}
	}
  
	async findAll(query: {
		search?: string
		sortBy?: string[]
		sortOrder?: ('asc' | 'desc')[]
		page?: number
		pageSize?: number
		filters?: any
	}): Promise<{
		data: Project[]
		total: number
		page: number
		pageSize: number
	}> {
		const {
			search = '',
			sortBy = ['id'],
			sortOrder = ['asc'],
			page = 1,
			pageSize = 10,
			filters = {}
		} = query

		try {
			const where = {
				AND: [
					search
						? {
								OR: [
									{
										title: {
											contains: search,
											mode: 'insensitive'
										}
									},
									{
										description: {
											contains: search,
											mode: 'insensitive'
										}
									}
								]
							}
						: {},
					filters
				]
			}

			const orderBy = sortBy.map((field, index) => ({
				[field]: sortOrder[index] || 'asc'
			}))

			const projects = await this.prisma.project.findMany({
				where,
				orderBy,
				skip: (page - 1) * pageSize,
				take: pageSize
			})

			const total = await this.prisma.project.count({ where })

			return {
				data: projects,
				total,
				page,
				pageSize
			}
		} catch (error) {
			throw new InternalServerErrorException(
				`Ошибка при получении проектов: ${error.message}`
			)
		}
	}

	async findOne(id: number) {
		return this.prisma.project.findUnique({
			where: { id }
		})
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
				throw new NotFoundException('Проект с ID ${id} не найден')
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
				`Ошибка при обновлении проекта: ${error}`,
				error
			)
		}
	}

	async remove(id: number) {
		return this.prisma.project.delete({
			where: { id }
		})
	}
}
