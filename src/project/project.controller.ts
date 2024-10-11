import {
	Controller,
	Get,
	Post,
	Put,
	Body,
	Param,
	Patch,
	Query,
	ValidationPipe,
	UsePipes,
	ParseIntPipe,
	Req
} from '@nestjs/common'
import { ProjectService } from './project.service'
import {
	ApiTags,
	ApiResponse,
	ApiOperation,
	ApiBody,
	ApiParam,
	ApiBearerAuth,
} from '@nestjs/swagger'
import { CreateProjectDto, ProjectDto, ProjectWithTasksDto, UpdateProjectDto, UpdateProjectStatusDto } from './dto/project.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Project, ProjectStatus } from '@prisma/client'
import { FilterProjectDto, PaginatedProjectResponseDto } from './dto/filter-project.dto'

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
		@Body() createProjectDto: CreateProjectDto, @Req() req: Request
	): Promise<Project> {
		const adminId = req['user'].id
		return this.projectService.createProject(createProjectDto, adminId)
	}

	@Get()
	@ApiOperation({ summary: 'Получить все проекты' })
	@ApiResponse({
		status: 200,
		description: 'Список проектов.',
		type: PaginatedProjectResponseDto
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async findAll(@Query() filterProjectDto: FilterProjectDto) {
		return this.projectService.findAll(filterProjectDto)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить проект по ID' })
	@ApiResponse({
		status: 200,
		description: 'Найден проект.',
		type: ProjectWithTasksDto
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
		@Body() updateProjectDto: UpdateProjectDto,
		@Req() req: Request
	): Promise<Project> {
		const adminId = req['user'].id
		const projectId = parseInt(id)
		return this.projectService.updateProject(projectId, updateProjectDto, adminId)
	}

	@ApiBody({ type: UpdateProjectStatusDto })
	@ApiResponse({ status: 200, description: 'OK', type: ProjectDto })
	@ApiResponse({ status: 400, description: 'Неверные данные запроса.' })
	@ApiResponse({ status: 404, description: 'Проект не найден.' })
	@Put(':id/status')
	@Auth('admin')
	async updateProjectStatus(@Param('id', ParseIntPipe) id: number, @Body() updateProjectStatusDto: UpdateProjectStatusDto, @Req() req: Request) {
		const adminId = req['user'].id
		return this.projectService.updateProjectStatus(id, updateProjectStatusDto, adminId)
	}

	// @Delete(':id')
	// @ApiOperation({ summary: 'Удалить проект' })
	// @ApiResponse({ status: 204, description: 'Проект успешно удален.' })
	// @ApiResponse({ status: 404, description: 'Проект не найден.' })
	// @Auth('admin')
	// remove(@Param('id') id: string) {
	// 	return this.projectService.remove(+id)
	// }
}
