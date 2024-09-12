import { PartialType } from '@nestjs/mapped-types'
import { CreateTransactionDto } from './create-transaction.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsDecimal, IsNumber, IsOptional } from 'class-validator'
import { Decimal } from '@prisma/client/runtime/library'

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsNumber()
	projectId?: number

	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsNumber()
	taskId?: number

	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsNumber()
	fromUserId?: number

	@ApiProperty({ example: 2, required: false })
	@IsOptional()
	@IsNumber()
	toUserId?: number

	@ApiProperty({ example: 500, required: false })
	@IsOptional()
	@IsDecimal()
	amount?: Decimal
}
