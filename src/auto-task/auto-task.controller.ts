import {
	Body,
	Controller,
	Get,
	InternalServerErrorException,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AutoTaskService } from './auto-task.service'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import {
	AutoTaskDto,
	CreateAutoTaskDto,
	UpdateAutoTaskDto
} from './dto/auto-task.dto'
import { AutoTask } from '@prisma/client'
import {
	FilterAutoTaskDto,
	PaginatedAutoTaskApplicationResponseDto,
	PaginatedAutoTaskResponseDto
} from './dto/fielter-auto-task.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'

@ApiTags('auto-task')
@ApiBearerAuth('access-token')
@Controller('auto-task')
export class AutoTaskController {
	constructor(private readonly autoTaskService: AutoTaskService) {}

	@ApiOperation({ summary: 'Создать авто-задачу' })
	@ApiBody({ type: CreateAutoTaskDto })
	@ApiResponse({
		status: 201,
		description: 'Задача создана успешно.',
		type: AutoTaskDto
	})
	@ApiResponse({ status: 500, description: 'Ошибка создания задачи.' })
	@Post()
	async createTask(@Body() dto: CreateAutoTaskDto): Promise<AutoTask> {
		try {
			return await this.autoTaskService.createTask(dto)
		} catch (error) {
			throw new InternalServerErrorException(error.message)
		}
	}

	@ApiOperation({
		summary: 'Get all auto task applications with optional filters'
	})
	@ApiQuery({
		name: 'userId',
		required: false,
		description: 'Filter by user ID',
		example: 1
	})
	@ApiQuery({
		name: 'taskId',
		required: false,
		description: 'Filter by task ID',
		example: 1
	})
	@ApiQuery({
		name: 'page',
		required: false,
		description: 'Number of page',
		example: 1
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		description: 'Number of objects to show',
		example: 1
	})
	@ApiResponse({ status: 200, type: [PaginatedAutoTaskApplicationResponseDto] })
	@Get('applications')
	async getAutoTaskApplications(
		@Query('userId') userId?: number,
		@Query('taskId') taskId?: number,
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 10
	) {
		return await this.autoTaskService.getAutoTaskApplications(
			Number(userId),
			Number(taskId),
			Number(page),
			Number(limit)
		)
	}

	@Get()
	@ApiOperation({ summary: 'Получить все автоматически задачи' })
	@ApiResponse({
		status: 200,
		description: 'Список транзакций.',
		type: [PaginatedAutoTaskResponseDto]
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@Auth('admin')
	async getAutoTasks(@Query() filterAutoTaskDto: FilterAutoTaskDto) {
		return this.autoTaskService.getAutoTasks(filterAutoTaskDto)
	}

	@ApiOperation({ summary: 'Создать авто-задачу' })
	@ApiBody({ type: UpdateAutoTaskDto })
	@ApiResponse({ status: 201, description: 'Задача обновлена успешно.' })
	@ApiResponse({ status: 500, description: 'Ошибка обновления задачи.' })
	@Put(':id/update')
	async updateTask(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateAutoTaskDto
	): Promise<AutoTask> {
		try {
			return await this.autoTaskService.updateTask(id, dto)
		} catch (error) {
			throw new InternalServerErrorException(error.message)
		}
	}
}
