import { ApiPropertyOptional } from '@nestjs/swagger'
import { TransactionType } from '@prisma/client'
import {
	IsOptional,
	IsInt,
	IsEnum,
	IsDecimal,
	IsArray,
	IsString
} from 'class-validator'
import { Transform } from 'class-transformer'
import { Decimal } from '@prisma/client/runtime/library'

export class FilterTransactionDto {
	@ApiPropertyOptional({ example: 1, description: 'ID проекта' })
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => (value !== undefined ? Number(value) : null))
	projectId?: number | null

	@ApiPropertyOptional({ example: 1, description: 'ID задачи' })
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => (value !== undefined ? Number(value) : null))
	taskId?: number | null

	@ApiPropertyOptional({
		example: 1,
		description: 'ID пользователя, от которого идет транзакция'
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => (value !== undefined ? Number(value) : null))
	fromUserId?: number | null

	@ApiPropertyOptional({
		example: 2,
		description: 'ID пользователя, которому идет транзакция'
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => (value !== undefined ? Number(value) : null))
	toUserId?: number | null

	@ApiPropertyOptional({
		example: 100,
		description: 'Минимальная сумма транзакции',
		type: Decimal
	})
	@IsOptional()
	@IsDecimal()
	amountFrom?: Decimal | null

	@ApiPropertyOptional({
		example: 1000,
		description: 'Максимальная сумма транзакции',
		type: Decimal
	})
	@IsOptional()
	@IsDecimal()
	amountTo?: Decimal | null

	@ApiPropertyOptional({
		example: TransactionType.PAYMENT,
		description: 'Тип транзакции'
	})
	@IsOptional()
	@IsEnum(TransactionType)
	type?: TransactionType

	@ApiPropertyOptional({
		example: ['createdAt', 'amount'],
		description: 'Поля для сортировки'
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	sortBy?: string[]

	@ApiPropertyOptional({
		example: ['asc', 'desc'],
		description: 'Порядок сортировки'
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	sortOrder?: ('asc' | 'desc')[]

    @ApiPropertyOptional({ example: 1, description: 'Номер страницы для пагинации' })
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => (value ? Number(value) : null))
	page?: number | null;

	@ApiPropertyOptional({ example: 10, description: 'Количество записей на странице' })
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => (value ? Number(value) : null))
	limit?: number | null;
}
