import { IsInt, IsObject, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class AdminActionLogDto {
	@ApiProperty({ example: 1, description: 'ID of the admin action log' })
	@IsInt()
	id: number
	@ApiProperty({ example: 'create', description: 'Action performed' })
	@IsString()
	action: string
	@ApiProperty({ example: 'user', description: 'Type of the entity' })
	@IsString()
	entityType: string
	@ApiProperty({ example: 1, description: 'ID of the entity' })
	@IsInt()
	entityId: number
	@ApiProperty({ example: {}, description: 'Old data of the entity' })
	@IsOptional()
	@IsObject()
	oldData: any
	@ApiProperty({ example: {}, description: 'New data of the entity' })
	@IsOptional()
	@IsObject()
	newData: any
	@ApiProperty({ example: 1, description: 'ID of the admin' })
	@IsInt()
	adminId: number
}
