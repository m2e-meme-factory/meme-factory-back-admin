import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
	IsOptional,
	IsString,
	IsNotEmpty,
	IsDecimal,
	IsUrl,
	IsInt,
	IsBoolean,
	IsNumber
} from 'class-validator'
import { Decimal } from '@prisma/client/runtime/library'
import { AutoTask, User } from '@prisma/client'

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
export class AutoTaskDto {
	@ApiProperty({
		description: 'Id of the automatic task',
		example: 5
	})
	@IsOptional()
	@IsNumber()
	id: number

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
	isConfirmed: boolean

	@ApiProperty({
		description: 'Creation date of the task application',
		example: '2024-01-01T00:00:00.000Z',
		readOnly: true
	})
	@IsOptional()
	createdAt?: Date
}
export class AutoTaskApplicationDto {
	@ApiProperty({
		description: 'ID of the application for the task',
		example: 1
	})
	@IsNotEmpty()
	@IsInt()
	id: number

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
	isConfirmed: boolean

	@ApiProperty({
		description: 'Creation date of the task application',
		example: '2024-01-01T00:00:00.000Z',
		readOnly: true
	})
	@IsOptional()
	createdAt?: Date

	@ApiProperty({ description: 'Task', type: AutoTaskDto })
	task: AutoTask
	@ApiProperty({
		description: 'Task',
		example: {
			user: {
				id: 5,
				telegramId: '123456789',
				username: 'username',
				isBaned: false,
				isVerified: false,
				createdAt: '2024-09-12T17:41:53.530Z',
				inviterRefCode: null,
				refCode: '33e16df7-625c-4195-ad63-b4fbcc49a961',
				role: 'creator',
				balance: '100',
				isSended: true,
				wasOpened: false
			}
		}
	})
	user: User
}

export class UpdateAutoTaskDto extends PartialType(CreateAutoTaskDto) {}
