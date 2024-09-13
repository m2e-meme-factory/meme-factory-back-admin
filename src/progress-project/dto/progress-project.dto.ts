// src/progress-project/dto/create-progress-project.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional } from 'class-validator'
import { ProgressStatus } from '@prisma/client'
import { GetEventDto } from './event.dto';

export class CreateProgressProjectDto {
	@ApiProperty({ description: 'ID пользователя', example: 1 })
	@IsInt()
	userId: number;
  
	@ApiProperty({ description: 'ID проекта', example: 1 })
	@IsInt()
	projectId: number;
  
	@ApiProperty({ enum: ProgressStatus, default: ProgressStatus.pending })
	@IsEnum(ProgressStatus)
	status?: ProgressStatus;
  
  }


export class UpdateProgressProjectDto {
	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	userId?: number;
  
	@ApiProperty({ required: false })
	@IsOptional()
	@IsInt()
	projectId?: number;
  
	@ApiProperty({
		description: 'Статус прогресса проекта',
		enum: ProgressStatus,
		default: ProgressStatus.pending
	})
	@IsOptional()
	@IsEnum(ProgressStatus)
	status?: ProgressStatus;
  }

  export class GetProgressProjectDto {
	@ApiProperty()
	id: number;
  
	@ApiProperty()
	userId: number;
  
	@ApiProperty()
	projectId: number;
  
	@ApiProperty({ enum: ProgressStatus })
	status: ProgressStatus;
  
	@ApiProperty()
	createdAt: Date;
  
	@ApiProperty()
	updatedAt: Date;
  ж
	@ApiProperty({ type: GetEventDto })
	events: Event[];
  }