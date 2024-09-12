import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
	IsOptional,
	IsString,
	IsNotEmpty,
	IsDecimal,
	IsUrl,
	IsInt,
	IsBoolean
} from 'class-validator'
import { Decimal } from '@prisma/client/runtime/library'

export class CreateAutoTaskDto {
	@ApiProperty({
		description: 'Title of the automatic task',
		example: 'Complete the tutorial'
	})
	@IsOptional()
	@IsString()
	title?: string

	@ApiProperty({
		description: 'Description of the automatic task',
		example: 'Complete the tutorial to earn a reward.'
	})
	@IsOptional()
	@IsString()
	description?: string

	@ApiProperty({
		description: 'Reward for completing the task',
		example: '100.00'
	})
	@IsNotEmpty()
	@IsDecimal()
	reward: Decimal

	@ApiProperty({
		description: 'URL associated with the task, if any',
		example: 'https://example.com/task',
		required: false
	})
	@IsOptional()
	@IsUrl()
	url?: string

	@ApiProperty({ example: false })
	@IsOptional()
	@IsBoolean()
	isIntegrated?: boolean

	@ApiProperty({
		description: 'Creation date of the task',
		example: '2024-01-01T00:00:00.000Z',
		readOnly: true
	})
	@IsOptional()
	createdAt?: Date
}

export class CreateAutoTaskApplicationDto {
	@ApiProperty({
		description: 'ID of the user applying for the task',
		example: 1
	})
	@IsNotEmpty()
	@IsInt()
	userId: number

	@ApiProperty({
		description: 'ID of the task being applied for',
		example: 1
	})
	@IsNotEmpty()
	@IsInt()
	taskId: number

	@ApiProperty({
		description: 'Indicates if the task is integrated',
		example: false
	})
	@IsBoolean()
	isIntegrated: boolean

	@ApiProperty({
		description: 'Creation date of the task application',
		example: '2024-01-01T00:00:00.000Z',
		readOnly: true
	})
	@IsOptional()
	createdAt?: Date
}

export class UpdateAutoTaskDto extends PartialType(CreateAutoTaskDto) {}
