// src/progress-project/dto/create-progress-project.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { ProgressStatus } from '@prisma/client'

export class CreateProgressProjectDto {
	@ApiProperty({ description: 'ID пользователя', example: 1 })
	@IsNumber()
	userId: number

	@ApiProperty({ description: 'ID проекта', example: 1 })
	@IsNumber()
	projectId: number
}

export class UpdateProgressProjectDto extends PartialType(
	CreateProgressProjectDto
) {
	@ApiProperty({
		description: 'Статус прогресса проекта',
		enum: ProgressStatus,
		default: ProgressStatus.pending
	})
	@IsEnum(ProgressStatus)
	@IsOptional()
	status: ProgressStatus
}
