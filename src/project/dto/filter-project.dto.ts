import { ApiProperty } from '@nestjs/swagger'
import { ProjectStatus } from '@prisma/client'
import { IsOptional, IsString, IsArray, IsEnum, IsInt, ArrayMinSize } from 'class-validator'
import { ProjectWithTasksDto } from './project.dto'
import { Transform } from 'class-transformer'

export class FilterProjectDto {
	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsInt()
    @Transform(({ value }) => (value ? Number(value) : undefined))
	authorId?: number

	@ApiProperty({ example: 'Example Title', required: false })
	@IsOptional()
	@IsString()
	title?: string

	@ApiProperty({ example: 'Example Description', required: false })
	@IsOptional()
	@IsString()
	description?: string

	@ApiProperty({ example: ['tag1', 'tag2'], required: false })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@ArrayMinSize(1)
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	tags?: string[]

	@ApiProperty({ example: 'Category Name', required: false })
	@IsOptional()
	@IsString()
	category?: string

	@ApiProperty({ enum: ProjectStatus, required: false })
	@IsOptional()
	@IsEnum(ProjectStatus)
	status?: ProjectStatus

	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@IsInt()
    @Transform(({ value }) => (value ? Number(value) : undefined))
	page?: number

	@ApiProperty({ example: 10, required: false })
	@IsOptional()
	@IsInt()
    @Transform(({ value }) => (value ? Number(value) : undefined))
	limit?: number

	@ApiProperty({ example: ['id', 'title'], required: false })
	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	sortBy?: string[]

	@ApiProperty({ example: ['asc', 'desc'], required: false })
	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	sortOrder?: string[]
}

export class PaginatedProjectResponseDto {
	@ApiProperty({ example: 100 })
	total: number

	@ApiProperty({ type: [ProjectWithTasksDto] })
	projects: ProjectWithTasksDto
}
