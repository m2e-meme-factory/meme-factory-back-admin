import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ProgressStatus } from '@prisma/client'
import { Transform } from 'class-transformer'

export class FilterProgressProjectDto {
	@ApiProperty({
		description: 'ID пользователя',
		example: 1,
		required: false
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	userId?: number

	@ApiProperty({
		description: 'ID проекта',
		example: 42,
		required: false
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	projectId?: number

	@ApiProperty({
		description: 'Статус прогресса проекта',
		enum: ProgressStatus,
		example: ProgressStatus.pending,
		required: false
	})
	@IsOptional()
	@IsEnum(ProgressStatus)
	@Transform(({ value }) => value)
	status?: ProgressStatus

	@ApiProperty({
		description: 'Номер страницы для пагинации',
		example: 1,
		required: false
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	page?: number

	@ApiProperty({
		description: 'Количество элементов на странице для пагинации',
		example: 10,
		required: false
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	limit?: number

	@ApiProperty({
		description: 'Поля для сортировки',
		example: ['id', 'createdAt'],
		required: false
	})
	@IsOptional()
	@IsString({ each: true })
	sortBy?: string[]

	@ApiProperty({
		description: 'Порядок сортировки для каждого поля',
		example: ['asc', 'desc'],
		required: false
	})
	@IsOptional()
	@IsString({ each: true })
	sortOrder?: string[]
}
