import { ApiProperty } from "@nestjs/swagger";
import { EventType, UserRole } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";


export class CreateEventDto {
    @ApiProperty({
        description: 'ID проекта, к которому относится событие',
        example: 1
    })
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    projectId: number;
  
    @ApiProperty({
        description: 'ID пользователя, который создал событие',
        example: 42
    })
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    userId: number;
  
    @ApiProperty({
        description: 'Роль пользователя при создании события',
        enum: UserRole,
        example: UserRole.creator
    })
    @IsEnum(UserRole)
    role: UserRole;
  
    @ApiProperty({
        description: 'Тип события',
        enum: EventType,
        example: EventType.USER_MESSAGE
    })
    @IsEnum(EventType)
    eventType: EventType;
  
    @ApiProperty({
        description: 'Описание события (опционально)',
        example: 'Пользователь оставил комментарий к проекту',
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiProperty({
        description: 'Дополнительные данные события в формате JSON (опционально)',
        example: { data: 'details' },
        required: false
    })
    @IsOptional()
    details?: any;
  
    @ApiProperty({
        description: 'Сообщение, связанное с событием (опционально)',
        example: 'Комментарий добавлен успешно',
        required: false
    })
    @IsOptional()
    @IsString()
    message?: string;
}

  
  
export class UpdateEventDto {
    @ApiProperty({
        description: 'ID проекта (опционально)',
        example: 1,
        required: false
    })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value, 10))
    projectId?: number;
  
    @ApiProperty({
        description: 'ID пользователя (опционально)',
        example: 42,
        required: false
    })
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value, 10))
    userId?: number;
  
    @ApiProperty({
        description: 'Роль пользователя (опционально)',
        enum: UserRole,
        example: UserRole.creator,
        required: false
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
  
    @ApiProperty({
        description: 'Тип события (опционально)',
        enum: EventType,
        example: EventType.PROJECT_UPDATED,
        required: false
    })
    @IsOptional()
    @IsEnum(EventType)
    eventType?: EventType;
  
    @ApiProperty({
        description: 'Описание события (опционально)',
        example: 'Пользователь изменил описание проекта',
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiProperty({
        description: 'Дополнительные данные события в формате JSON (опционально)',
        example: { data: 'details' },
        required: false
    })
    @IsOptional()
    details?: any;
  
    @ApiProperty({
        description: 'Сообщение, связанное с событием (опционально)',
        example: 'Описание проекта было изменено',
        required: false
    })
    @IsOptional()
    @IsString()
    message?: string;
}

export class GetEventDto {
    @ApiProperty({
        description: 'Уникальный идентификатор события',
        example: 1
    })
    @IsInt()
    @Transform(({ value }) => parseInt(value, 10))
    id: number;
  
    @ApiProperty({
        description: 'ID проекта, к которому относится событие',
        example: 1
    })
    @IsInt()
    @Transform(({ value }) => parseInt(value, 10))
    projectId: number;
  
    @ApiProperty({
        description: 'ID пользователя, который создал событие',
        example: 42
    })
    @IsInt()
    @Transform(({ value }) => parseInt(value, 10))
    userId: number;
  
    @ApiProperty({
        description: 'Роль пользователя при создании события',
        enum: UserRole,
        example: UserRole.creator
    })
    @IsEnum(UserRole)
    role: UserRole;
  
    @ApiProperty({
        description: 'Тип события',
        enum: EventType,
        example: EventType.USER_MESSAGE
    })
    @IsEnum(EventType)
    eventType: EventType;
  
    @ApiProperty({
        description: 'Описание события (опционально)',
        example: 'Пользователь добавил комментарий',
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string;
  
    @ApiProperty({
        description: 'Дополнительные данные события в формате JSON (опционально)',
        example: { data: 'details' },
        required: false
    })
    @IsOptional()
    details?: any;
  
    @ApiProperty({
        description: 'Сообщение, связанное с событием (опционально)',
        example: 'Комментарий добавлен',
        required: false
    })
    @IsOptional()
    @IsString()
    message?: string;
}