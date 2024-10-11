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
	Req,
	UsePipes,
	ValidationPipe,
	Delete
} from '@nestjs/common'
import { AutoTaskService } from './auto-task.service'
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiParam,
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
	@Auth('admin')
	async createTask(
		@Body() dto: CreateAutoTaskDto,
		@Req() req: Request
	): Promise<AutoTask> {
		try {
			const adminId = req['user'].id
			return await this.autoTaskService.createTask(dto, adminId)
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
	@ApiResponse({
		status: 200,
		type: [PaginatedAutoTaskApplicationResponseDto]
	})
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
	@Auth('admin')
	async updateTask(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateAutoTaskDto,
		@Req() req: Request
	): Promise<AutoTask> {
		try {
			const adminId = req['user'].id
			return await this.autoTaskService.updateTask(id, dto, adminId)
		} catch (error) {
			throw new InternalServerErrorException(error.message)
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete an auto task' })
	@ApiParam({ name: 'id', type: 'number', description: 'Auto task ID' })
	@ApiResponse({
		status: 200,
		description: 'The auto task has been successfully deleted.',
		type: AutoTaskDto
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request. taskId must be a number.'
	})
	@ApiResponse({ status: 404, description: 'Auto task not found.' })
	@ApiResponse({ status: 500, description: 'Internal server error.' })
	@Auth('admin')
	async deleteTask(
		@Param('id') id: string,
		@Req() req: Request
	): Promise<AutoTask> {
		const adminId = req['user'].id
		return this.autoTaskService.deleteTask(+id, adminId)
	}
}
