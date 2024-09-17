import { ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	ArrayMinSize
} from 'class-validator'
import { Transform } from 'class-transformer'
import { UserRole } from '@prisma/client'

export class FilterUserDto {
	@ApiPropertyOptional({
		description: 'Search term to filter by username or tag'
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

	@ApiPropertyOptional({
		description: 'Fields to sort by',
	})
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

	@ApiPropertyOptional({
		description: 'Filter by banned status',
		example: false
	})
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	isBanned?: boolean

	@ApiPropertyOptional({
		description: 'Filter by verified status',
		example: true
	})
	@IsOptional()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	isVerified?: boolean

	@ApiPropertyOptional({
		description: 'Filter by referral code',
		example: 'ABC123'
	})
	@IsOptional()
	@IsString()
	refCode?: string

	@ApiPropertyOptional({
		description: 'Filter by user role',
		enum: UserRole
	})
	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole
}
