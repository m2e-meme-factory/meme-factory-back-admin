import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiBearerAuth('access-token')
@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Создать транзакцию' })
  @ApiResponse({ status: 201, description: 'Транзакция успешно создана.', type: CreateTransactionDto })
  @ApiResponse({ status: 400, description: 'Неверные данные.' })
  @Auth('admin')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все транзакции' })
  @ApiResponse({ status: 200, description: 'Список транзакций.', type: [CreateTransactionDto] })
  @Auth('admin')
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить транзакцию по ID' })
  @ApiResponse({ status: 200, description: 'Найдена транзакция.', type: CreateTransactionDto })
  @ApiResponse({ status: 404, description: 'Транзакция не найдена.' })
  @Auth('admin')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить транзакцию' })
  @ApiResponse({ status: 200, description: 'Транзакция обновлена.', type: CreateTransactionDto })
  @ApiResponse({ status: 404, description: 'Транзакция не найдена.' })
  @Auth('admin')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить транзакцию' })
  @ApiResponse({ status: 204, description: 'Транзакция успешно удалена.' })
  @ApiResponse({ status: 404, description: 'Транзакция не найдена.' })
  @Auth('admin')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
