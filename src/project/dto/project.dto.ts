import { ApiProperty, OmitType } from '@nestjs/swagger'
import { ProjectStatus, ProjectTask } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import {
	ArrayMinSize,
	IsArray,
	IsDecimal,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString
} from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateTaskDto {
	@IsOptional()
	@IsNumber()
	id?: number

	@ApiProperty({ example: 'example title for task' })
	@IsString()
	title: string

	@ApiProperty({ example: 'example description for task' })
	@IsString()
	description: string

	@ApiProperty({ example: 1000 })
	@IsDecimal()
	price: Decimal
}

export class ProjectTaskDto {
	@ApiProperty({ example: 2 })
	@IsInt()
	projectId: number

	@ApiProperty({ example: 1 })
	@IsInt()
	taskId: number

	@ApiProperty({ type: CreateTaskDto })
	task: CreateTaskDto
}

export class ProjectWithTasksDto {
	@ApiProperty({ example: 1 })
	id: number

	@ApiProperty({ example: 1 })
	authorId: number

	@ApiProperty({ example: 'Example Project' })
	title: string

	@ApiProperty({ example: 'Description of the example project' })
	description: string

	@ApiProperty({ example: 'http://example.com/banner.png', required: false })
	bannerUrl?: string

	@ApiProperty({ example: ['file1.png', 'file2.png'], required: false })
	files?: string[]

	@ApiProperty({ example: ['tag1', 'tag2'] })
	tags: string[]

	@ApiProperty({ example: 'Category Name' })
	category: string

	@ApiProperty({ enum: ProjectStatus })
	status: ProjectStatus

	@ApiProperty({ type: [ProjectTaskDto] })
	tasks: ProjectTaskDto[]
}

export class ProjectDto {
	@ApiProperty({ example: 1 })
	id: number

	@ApiProperty({ example: 1 })
	authorId: number

	@ApiProperty({ example: 'Example Project' })
	title: string

	@ApiProperty({ example: 'Description of the example project' })
	description: string

	@ApiProperty({ example: 'http://example.com/banner.png', required: false })
	bannerUrl?: string

	@ApiProperty({ example: ['file1.png', 'file2.png'], required: false })
	files?: string[]

	@ApiProperty({ example: ['tag1', 'tag2'] })
	tags: string[]

	@ApiProperty({ example: 'Category Name' })
	category: string

	@ApiProperty({ enum: ProjectStatus })
	status: ProjectStatus

	@ApiProperty({ type: [CreateTaskDto] })
	tasks: ProjectTask

	@ApiProperty({ type: 'string', format: 'decimal', required: false })
	price?: Decimal
}

export class CreateProjectDto {
	@ApiProperty({ example: 1 })
	@IsNumber()
	authorId: number

	@ApiProperty({ example: 'Example Project' })
	@IsString()
	title: string

	@ApiProperty({ example: 'Description of the example project' })
	@IsString()
	description: string

	@ApiProperty({ example: 'http://example.com/banner.png' })
	@IsString()
	@IsOptional()
	bannerUrl?: string

	@ApiProperty({ example: ['file1.png', 'file2.png'] })
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	@ArrayMinSize(1)
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	files?: string[]

	@ApiProperty({ example: ['tag1', 'tag2'] })
	@IsArray()
	@IsString({ each: true })
	@ArrayMinSize(1)
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	tags: string[]

	@ApiProperty({ example: 'Category Name' })
	@IsString()
	category: string

	@ApiProperty({
		type: [CreateTaskDto]
	})
	@IsArray()
	@ArrayMinSize(1)
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	subtasks: CreateTaskDto[]
}

export class UpdateProjectDto extends OmitType(CreateProjectDto, [
	'authorId'
] as const) {
	@IsArray()
	@ApiProperty({ example: [1, 2, 3, 4, 5] })
	@IsOptional()
	@ArrayMinSize(1)
	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	deletedTasks?: number[]
}


export class UpdateProjectStatusDto {
	@ApiProperty({ enum: ProjectStatus })
	@IsEnum({ProjectStatus})
	status: ProjectStatus
}
// export class UpdateProjectApplicationStatusDto {
// 	@ApiProperty({ enum: ApplicationStatus })
// 	status: ApplicationStatus
// }

// export class UpdateTaskResponseStatusDto {
// 	@ApiProperty({ enum: ResponseStatus })
// 	status: ResponseStatus
// }

export class ApplyProjectDto {
	@IsInt()
	@IsNotEmpty()
	@ApiProperty({ example: 1 })
	projectId: number
}

export class RespondTaskDto {
	@IsInt()
	@IsNotEmpty()
	@ApiProperty({ example: 1 })
	taskId: number
}

export class RejectTaskCompletionDto {
	@ApiProperty({
		description: 'ID пользователя, создавшего задачу',
		example: 1
	})
	@IsNumber()
	creatorId: number
	@ApiProperty({
		description: 'ID события, которое принимаем',
		example: 1
	})
	@IsNumber()
	eventId: number

	@ApiProperty({
		description: 'Сообщение с причиной отклонения',
		example: 'Задача выполнена неверно.',
		required: false
	})
	@IsString()
	message?: string
}
