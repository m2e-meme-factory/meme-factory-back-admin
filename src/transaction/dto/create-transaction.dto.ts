import { ApiProperty } from '@nestjs/swagger'
import { TransactionType } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { IsInt, IsPositive, IsDecimal, Min, Max, IsDate, IsEnum } from 'class-validator'

export class CreateTransactionDto {
	@ApiProperty({ example: 1, description: 'ID проекта' })
	@IsInt()
	projectId: number

	@ApiProperty({ example: 1, description: 'ID задачи' })
	@IsInt()
	taskId: number

	@ApiProperty({
		example: 1,
		description: 'ID пользователя, от которого идет транзакция'
	})
	@IsInt()
	fromUserId: number

	@ApiProperty({
		example: 2,
		description: 'ID пользователя, которому идет транзакция'
	})
	@IsInt()
	toUserId: number

	@ApiProperty({
		example: 500,
		description: 'Сумма транзакции',
		type: 'string'
	})
	@IsDecimal()
	@IsPositive()
	@Min(0)
	@Max(1000000)
	amount: Decimal
}
export class TransactionDto {
	@ApiProperty({ example: 1, description: 'ID транзакции' })
	@IsInt()
	id: number
	@ApiProperty({ example: 1, description: 'ID проекта' })
	@IsInt()
	projectId: number

	@ApiProperty({ example: 1, description: 'ID задачи' })
	@IsInt()
	taskId: number

	@ApiProperty({
		example: 1,
		description: 'ID пользователя, от которого идет транзакция'
	})
	@IsInt()
	fromUserId: number

	@ApiProperty({
		example: 2,
		description: 'ID пользователя, которому идет транзакция'
	})
	@IsInt()
	toUserId: number

	@ApiProperty({
		example: 500,
		description: 'Сумма транзакции',
		type: 'string'
	})
	@IsDecimal()
	@IsPositive()
	@Min(0)
	@Max(1000000)
	amount: Decimal

 
	@IsDate()
	@ApiProperty({
		example: "2024-09-12T18:41:27.094Z",
		description: 'Дата создания',
		type: 'date'
	})
	createdAt: Date

	@ApiProperty({
		example: "SYSTEM",
		description: 'Тип транзакции',
		type: 'string'
	})
	@IsEnum({TransactionType})
	type: TransactionType
}

export class PaginatedTransactionResponseDto {
	@ApiProperty({ example: 100, description: 'Общее количество транзакций' })
	total: number;

	@ApiProperty({ type: [TransactionDto], description: 'Список транзакций' })
	transactions: TransactionDto[];
}
