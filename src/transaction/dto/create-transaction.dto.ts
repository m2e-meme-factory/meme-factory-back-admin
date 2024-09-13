import { ApiProperty } from '@nestjs/swagger'
import { Decimal } from '@prisma/client/runtime/library'
import { IsInt, IsPositive, IsDecimal, Min, Max } from 'class-validator'

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

export class PaginatedResponseDto {
	@ApiProperty({ example: 100, description: 'Общее количество транзакций' })
	total: number;

	@ApiProperty({ type: [CreateTransactionDto], description: 'Список транзакций' })
	transactions: CreateTransactionDto[];
}
