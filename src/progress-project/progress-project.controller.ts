// src/progress-project/progress-project.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common'
import { ProgressProjectService } from './progress-project.service'
import { ProgressProject } from '@prisma/client'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import {
	CreateProgressProjectDto,
	UpdateProgressProjectDto
} from './dto/progress-project.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'

@ApiTags('ProgressProjects')
@Controller('progress-projects')
export class ProgressProjectController {
	constructor(
		private readonly progressProjectService: ProgressProjectService
	) {}

	@Post()
	@ApiResponse({
		status: 201,
		description: 'Создан новый прогресс проекта',
		type: CreateProgressProjectDto
	})
	@Auth('admin')
	create(
		@Body() createProgressProjectDto: CreateProgressProjectDto
	): Promise<ProgressProject> {
		return this.progressProjectService.create(createProgressProjectDto)
	}

	@Get()
	@ApiResponse({
		status: 200,
		description: 'Получение всех прогрессов проектов',
		type: [CreateProgressProjectDto]
	})
	@Auth('admin')
	findAll(): Promise<ProgressProject[]> {
		return this.progressProjectService.findAll()
	}

	@Get(':id')
	@ApiResponse({
		status: 200,
		description: 'Получение прогресса проекта по ID',
		type: CreateProgressProjectDto
	})
	@ApiResponse({ status: 404, description: 'Прогресс проекта не найден' })
	@Auth('admin')
	findOne(@Param('id') id: number): Promise<ProgressProject> {
		return this.progressProjectService.findOne(id)
	}

	@Patch(':id')
	@ApiResponse({
		status: 200,
		description: 'Обновление прогресса проекта',
		type: CreateProgressProjectDto
	})
	@ApiResponse({ status: 404, description: 'Прогресс проекта не найден' })
	@Auth('admin')
	update(
		@Param('id') id: number,
		@Body() updateProgressProjectDto: UpdateProgressProjectDto
	): Promise<ProgressProject> {
		return this.progressProjectService.update(id, updateProgressProjectDto)
	}

	@Delete(':id')
	@ApiResponse({
		status: 200,
		description: 'Удаление прогресса проекта',
		type: CreateProgressProjectDto
	})
	@ApiResponse({ status: 404, description: 'Прогресс проекта не найден' })
	@Auth('admin')
	remove(@Param('id') id: number): Promise<ProgressProject> {
		return this.progressProjectService.remove(id)
	}
}
