import {
	IsOptional,
	IsString,
	IsInt,
	IsArray,
	ArrayMinSize
} from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class FilterUserDto {
	@ApiPropertyOptional({
		description: 'Search term to filter by name, description or ID'
	})
	@IsOptional()
	@IsString()
	search?: string

	@ApiPropertyOptional({
		description: 'Page number for pagination',
		example: 1
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => parseInt(value, 10))
	page?: number

	@ApiPropertyOptional({
		description: 'Limit of records per page',
		example: 10
	})
	@IsOptional()
	@IsInt()
	@Transform(({ value }) => parseInt(value, 10))
	limit?: number

	@ApiPropertyOptional({ description: 'Fields to sort by', example: '[name]' })
	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	sortBy?: string[]

	@ApiPropertyOptional({
		description: 'Sort orders for the fields',
		enum: ['asc', 'desc'],
		example: 'asc'
	})
	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	sortOrder?: ('asc' | 'desc')[]
}
