import { PartialType } from '@nestjs/mapped-types'
import { CreateTransactionDto } from './create-transaction.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsDecimal, IsEnum, IsNumber, IsOptional } from 'class-validator'
import { Decimal } from '@prisma/client/runtime/library'
import { TransactionType } from '@prisma/client'

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
	@ApiProperty({ example: 1, required: false, description: 'ID проекта' })
	@IsOptional()
	@IsNumber()
	projectId?: number

	@ApiProperty({ example: 1, required: false, description: 'ID задачи' })
	@IsOptional()
	@IsNumber()
	taskId?: number

	@ApiProperty({
		example: 1,
		required: false,
		description: 'ID пользователя, от которого идет транзакция'
	})
	@IsOptional()
	@IsNumber()
	fromUserId?: number

	@ApiProperty({
		example: 2,
		required: false,
		description: 'ID пользователя, которому идет транзакция'
	})
	@IsOptional()
	@IsNumber()
	toUserId?: number

	@ApiProperty({
		example: 500,
		required: false,
		description: 'Сумма транзакции',
		type: 'string'
	})
	@IsOptional()
	@IsDecimal()
	amount?: Decimal

	@ApiProperty({
		example: "SYSTEM",
		description: 'Тип транзакции',
		type: 'string'
	})
	@IsEnum({TransactionType})
	type: TransactionType
}
