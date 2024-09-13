import {
	Controller,
	Post,
	Body,
	Get,
	Query,
	Param,
	Patch,
	Delete,
	ValidationPipe,
	UsePipes
} from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { CreateTransactionDto, PaginatedResponseDto } from './dto/create-transaction.dto'
import { FilterTransactionDto } from './dto/filters-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import {
	ApiBearerAuth,
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBody
} from '@nestjs/swagger'

@ApiBearerAuth('access-token')
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Post()
	@ApiOperation({ summary: 'Создать транзакцию' })
	@ApiResponse({
		status: 201,
		description: 'Транзакция успешно создана.',
		type: CreateTransactionDto
	})
	@ApiResponse({ status: 400, description: 'Неверные данные.' })
	create(@Body() createTransactionDto: CreateTransactionDto) {
		return this.transactionService.create(createTransactionDto)
	}

	@Get()
	@ApiOperation({ summary: 'Получить все транзакции' })
	@ApiResponse({
		status: 200,
		description: 'Список транзакций.',
		type: [PaginatedResponseDto]
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async findAll(@Query() filterTransactionDto: FilterTransactionDto) {
		return this.transactionService.findAll(filterTransactionDto)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить транзакцию по ID' })
	@ApiResponse({
		status: 200,
		description: 'Найдена транзакция.',
		type: CreateTransactionDto
	})
	@ApiResponse({ status: 404, description: 'Транзакция не найдена.' })
	findOne(@Param('id') id: string) {
		return this.transactionService.findOne(+id)
	}

	@Patch(':id')
	@ApiBody({ type: UpdateTransactionDto })
	@ApiOperation({ summary: 'Обновить транзакцию' })
	@ApiResponse({
		status: 200,
		description: 'Транзакция обновлена.',
		type: CreateTransactionDto
	})
	@ApiResponse({ status: 404, description: 'Транзакция не найдена.' })
	update(
		@Param('id') id: string,
		@Body() updateTransactionDto: UpdateTransactionDto
	) {
		return this.transactionService.update(+id, updateTransactionDto)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удалить транзакцию' })
	@ApiResponse({ status: 204, description: 'Транзакция успешно удалена.' })
	@ApiResponse({ status: 404, description: 'Транзакция не найдена.' })
	remove(@Param('id') id: string) {
		return this.transactionService.remove(+id)
	}
}
