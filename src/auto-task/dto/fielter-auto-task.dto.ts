import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsArray,
	IsBoolean,
	IsInt,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator'
import { Transform } from 'class-transformer'
import { AutoTaskApplicationDto, AutoTaskDto } from './auto-task.dto'

export class PaginatedAutoTaskResponseDto {
	@ApiProperty({
		example: 100,
		description: 'Общее количество автоматических задач'
	})
	total: number
	@ApiProperty({ type: [AutoTaskDto], description: 'Автоматические задачи' })
	tasks: AutoTaskDto[]
}
export class PaginatedAutoTaskApplicationResponseDto {
	@ApiProperty({
		example: 100,
		description: 'Общее количество автоматических задач'
	})
	total: number
	@ApiProperty({ type: [AutoTaskApplicationDto], description: 'Автоматические задачи' })
	applications: AutoTaskApplicationDto[]
}

export class FilterAutoTaskDto {
	@ApiPropertyOptional({
		example: 'title',
		description: 'Заголовок автоматической задачи'
	})
	@IsOptional()
	@IsString()
	title?: string

	@ApiPropertyOptional({
		example: 'description',
		description: 'Описание автоматической задачи'
	})
	@IsOptional()
	@IsString()
	description?: string

	@ApiPropertyOptional({
		example: 50,
		description: 'Минимальное вознаграждение за автоматическую задачу'
	})
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => (value !== undefined ? Number(value) : null))
	rewardFrom?: number | null

	@ApiPropertyOptional({
		example: 200,
		description: 'Максимальное вознаграждение за автоматическую задачу'
	})
	@IsOptional()
	@IsNumber()
	@Transform(({ value }) => (value !== undefined ? Number(value) : null))
	rewardTo?: number | null

	@ApiPropertyOptional({
		example: 'https://t.me/meme-factory-bot',
		description: 'Ссылка на автоматическую задачу'
	})
	@IsOptional()
	@IsString()
	url?: string

	@ApiPropertyOptional({
		example: true,
		description: 'Интегрирована ли задача'
	})
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => {
		if (value === 'false') return false
		return value !== undefined ? Boolean(value) : null 
	})
	isIntegrated?: boolean

	@ApiPropertyOptional({
		example: 1,
		description: 'Номер страницы для пагинации'
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => (value !== undefined ? Number(value) : null))
	page?: number

	@ApiPropertyOptional({
		example: 10,
		description: 'Количество элементов на странице'
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => (value !== undefined ? Number(value) : null))
	limit?: number

	@ApiPropertyOptional({
		example: ['title'],
		description: 'Поля для сортировки'
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Transform(({ value }) => {
		return Array.isArray(value) ? value : value ? [value] : []
	})
	sortBy?: string[]
    
	@ApiPropertyOptional({
        example: ['asc', 'desc'],
		description: 'Порядок сортировки'
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
    @Transform(({ value }) => {
        return Array.isArray(value) ? value : value ? [value] : []
    })
	sortOrder?: ('asc' | 'desc')[]
}
