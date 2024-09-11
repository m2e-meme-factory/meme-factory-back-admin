import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	Query
} from '@nestjs/common'
import { ProjectService } from './project.service'
import {
	ApiTags,
	ApiResponse,
	ApiOperation,
	ApiBody,
	ApiParam,
	ApiQuery,
	ApiBearerAuth
} from '@nestjs/swagger'
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Project, ProjectStatus } from '@prisma/client'

@ApiBearerAuth('access-token')
@ApiTags('projects')
@Controller('projects')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	@ApiOperation({ summary: 'Создать проект' })
	@ApiBody({ type: CreateProjectDto })
	@ApiResponse({
		status: 201,
		description: 'Проект успешно создан.',
		schema: {
			example: {
				id: 1,
				authorId: 1,
				title: 'Example Project',
				description: 'Description of the example project',
				bannerUrl: 'http://example.com/banner.png',
				files: ['file1.png', 'file2.png'],
				tags: ['tag1', 'tag2'],
				category: 'Category Name',
				price: 1000,
				status: ProjectStatus.draft
			}
		}
	})
	@ApiResponse({ status: 400, description: 'Неверные данные запроса.' })
	@Auth('admin')
	async createProject(
		@Body() createProjectDto: CreateProjectDto
	): Promise<Project> {
		return this.projectService.createProject(createProjectDto)
	}

	@Get()
	@ApiOperation({
		summary: 'Получить все проекты с фильтрацией, сортировкой и пагинацией'
	})
	@ApiResponse({
		status: 200,
		description: 'Список проектов.',
		type: [CreateProjectDto]
	})
	@Auth('admin')
	@ApiQuery({
		name: 'search',
		required: false,
		description: 'Поиск по названию и описанию'
	})
	@ApiQuery({
		name: 'sortBy',
		required: false,
		description: 'Поля для сортировки',
		type: [String]
	})
	@ApiQuery({
		name: 'sortOrder',
		required: false,
		description: 'Порядок сортировки',
		enum: ['asc', 'desc'],
		isArray: true
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: 'Номер страницы',
		type: Number
	})
	@ApiQuery({
		name: 'pageSize',
		required: false,
		description: 'Количество элементов на странице',
		type: Number
	})
	@ApiQuery({
		name: 'filters',
		required: false,
		description: 'Фильтры для поиска',
		type: Object
	})
	async findAll(
		@Query('search') search?: string,
		@Query('sortBy') sortBy?: string[],
		@Query('sortOrder') sortOrder?: ('asc' | 'desc')[],
		@Query('page') page?: number,
		@Query('pageSize') pageSize?: number,
		@Query('filters') filters?: any
	): Promise<{
		data: Project[]
		total: number
		page: number
		pageSize: number
	}> {
		return this.projectService.findAll({
			search,
			sortBy,
			sortOrder,
			page,
			pageSize,
			filters
		})
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить проект по ID' })
	@ApiResponse({
		status: 200,
		description: 'Найден проект.',
		type: CreateProjectDto
	})
	@ApiResponse({ status: 404, description: 'Проект не найден.' })
	@Auth('admin')
	findOne(@Param('id') id: string) {
		return this.projectService.findOne(+id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Обновить проект' })
	@ApiParam({ name: 'id', description: 'ID проекта' })
	@ApiBody({ type: UpdateProjectDto })
	@ApiResponse({
		status: 200,
		description: 'Проект успешно обновлен.',
		schema: {
			example: {
				id: 1,
				authorId: 1,
				title: 'Updated Project',
				description: 'Updated description of the project',
				bannerUrl: 'http://example.com/banner_updated.png',
				files: ['file1.png', 'file2.png'],
				tags: ['updatedTag1', 'updatedTag2'],
				category: 'Updated Category Name',
				price: 2000,
				tasks: [
					{
						projectId: 20,
						taskId: 19,
						task: {
							id: 19,
							title: 'example title of task for validation',
							description: 'example decription',
							price: 10
						}
					}
				]
			}
		}
	})
	@ApiResponse({ status: 400, description: 'Неверные данные запроса.' })
	@ApiResponse({ status: 404, description: 'Проект не найден.' })
	@Auth('admin')
	async updateProject(
		@Param('id') id: string,
		@Body() updateProjectDto: UpdateProjectDto
	): Promise<Project> {
		const projectId = parseInt(id)
		return this.projectService.updateProject(projectId, updateProjectDto)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удалить проект' })
	@ApiResponse({ status: 204, description: 'Проект успешно удален.' })
	@ApiResponse({ status: 404, description: 'Проект не найден.' })
	@Auth('admin')
	remove(@Param('id') id: string) {
		return this.projectService.remove(+id)
	}
}
