import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsPositive, IsDecimal, Min, Max } from 'class-validator'

export class CreateTransactionDto {
	@ApiProperty({ example: 1 })
	@IsInt()
	projectId: number

	@ApiProperty({ example: 1 })
	@IsInt()
	taskId: number

	@ApiProperty({ example: 1 })
	@IsInt()
	fromUserId: number

	@ApiProperty({ example: 2 })
	@IsInt()
	toUserId: number

	@ApiProperty({ example: 500 })
	@IsDecimal()
	@IsPositive()
	@Min(0)
	@Max(1000000)
	amount: number
}
