// src/progress-project/progress-project.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { ProgressProject } from '@prisma/client'
import { UpdateProgressProjectDto } from './dto/progress-project.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { FilterProgressProjectDto } from './dto/filter-progress-project.dto'

@Injectable()
export class ProgressProjectService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data): Promise<ProgressProject> {
		return this.prisma.progressProject.create({
			data
		})
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
			whereClause.status = status
		}

		const sortByArray = Array.isArray(sortBy) ? sortBy : [sortBy]
		const sortOrderArray = Array.isArray(sortOrder)
			? sortOrder
			: [sortOrder]

		const orderBy = sortByArray.map((field, index) => ({
			[field]: sortOrderArray[index] || 'asc'
		}))

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
					this.prisma.progressProject.count({ where: whereClause }),
					projects
				])
			)

		return { total, progressProjects }
	}

	async findOne(id: number): Promise<ProgressProject> {
		const progressProject = await this.prisma.progressProject.findUnique({
			where: { id },
			include: { events: true }
		})
		if (!progressProject) {
			throw new NotFoundException(
				`ProgressProject with ID ${id} not found`
			)
		}
		return progressProject
	}

	async update(
		id: number,
		data: UpdateProgressProjectDto
	): Promise<ProgressProject> {
		return this.prisma.progressProject.update({
			where: { id },
			data
		})
	}

	async remove(id: number): Promise<ProgressProject> {
		return this.prisma.progressProject.delete({
			where: { id }
		})
	}
}
