// src/progress-project/progress-project.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { ProgressProject } from '@prisma/client'
import { UpdateProgressProjectDto } from './dto/progress-project.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class ProgressProjectService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data): Promise<ProgressProject> {
		return this.prisma.progressProject.create({
			data
		})
	}

	async findAll(): Promise<ProgressProject[]> {
		return this.prisma.progressProject.findMany({
			include: { events: true }
		})
	}

	async findOne(id: number): Promise<ProgressProject> {
		const progressProject = await this.prisma.progressProject.findUnique({
			where: { id },
			include: {events: true}
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
