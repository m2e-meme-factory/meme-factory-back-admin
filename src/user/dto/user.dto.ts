import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
	IsBoolean,
	IsDecimal,
	IsEmail,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString
} from 'class-validator'
import { UserRole } from '@prisma/client'
import { Transform } from 'class-transformer'
import { Decimal } from '@prisma/client/runtime/library'

export class UserInfoDto {
	@ApiProperty({
		description: 'ID информации о профиле',
		example: 1
	})
	@IsOptional()
	@IsInt()
	id?: number

	@ApiProperty({
		description: 'ID пользователя',
		example: 1
	})
	@IsOptional()
	@IsInt()
	userId?: number

	@ApiProperty({
		description: 'Имя пользователя',
		example: 'John'
	})
	@IsOptional()
	@IsString()
	name?: string

	@ApiProperty({
		description: 'Номер телефона пользователя',
		example: '+79999999999'
	})
	@IsOptional()
	@IsString()
	phoneNumber?: string
	@ApiProperty({
		description: 'Email пользователя',
		example: 'mail@mail.ru'
	})
	@IsOptional()
	@IsEmail()
	email?: string
	@ApiProperty({
		description: 'Адрес ton кошелька пользователя',
		example: 'string'
	})
	@IsOptional()
	@IsEmail()
	tonWalletAddress?: string
}

export class MetaTagDto {
	@ApiProperty({
		description: 'ID тэга',
		example: 1
	})
	@IsNotEmpty()
	@IsInt()
	id: number

	@ApiProperty({
		description: 'ID пользователя',
		example: 1
	})
	@IsNotEmpty()
	@IsInt()
	userId: number
}

export class CreateUserDto {
	@ApiProperty({
		description: 'Telegram ID пользователя',
		example: '123456789'
	})
	@IsNotEmpty()
	@IsString()
	telegramId: string

	@ApiProperty({ description: 'Имя пользователя', example: 'example_user' })
	@IsOptional()
	@IsString()
	username?: string

	@ApiProperty({
		description: 'Заблокирован ли пользователь',
		default: false
	})
	@IsBoolean()
	@Transform(({ value }) => value === 'true') // Преобразование из строки в boolean
	isBaned?: boolean

	@ApiProperty({
		description: 'Подтвержден ли пользователь',
		default: false
	})
	@IsBoolean()
	@Transform(({ value }) => value === 'true') // Преобразование из строки в boolean
	isVerified?: boolean

	@ApiProperty({ description: 'Реферальный код', example: 'ABC123' })
	@IsNotEmpty()
	@IsString()
	refCode: string

	@ApiProperty({
		description: 'Роль пользователя',
		enum: UserRole,
		default: UserRole.creator
	})
	@IsOptional()
	@IsEnum(UserRole)
	role?: UserRole

	@ApiProperty({ description: 'Баланс пользователя', default: 0 })
	@IsOptional()
	@Transform(({ value }) => parseFloat(value))
	balance?: Decimal
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ApiProperty({
		description: 'Имя пользователя',
		example: 'example_user'
	})
	@IsOptional()
	@IsString()
	username?: string

	@ApiProperty({
		description: 'Заблокирован ли пользователь',
		default: false
	})
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	isBaned?: boolean

	@ApiProperty({
		description: 'Подтвержден ли пользователь',
		default: false
	})
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	isVerified?: boolean

	@ApiProperty({
		description: 'Реферальный код',
		example: 'ABC123'
	})
	@IsString()
	refCode: string

	@ApiProperty({
		description: 'Роль пользователя',
		enum: UserRole,
		example: UserRole.creator
	})
	@IsEnum(UserRole)
	role: UserRole
}

export class GetUserDto {
	@ApiProperty({
		description: 'ID пользователя',
		example: 1
	})
	@IsNotEmpty()
	@IsString()
	id: number

	@ApiProperty({
		description: 'Telegram ID пользователя',
		example: '123456789'
	})
	@IsNotEmpty()
	@IsString()
	telegramId: string

	@ApiProperty({
		description: 'Имя пользователя',
		example: 'example_user'
	})
	@IsOptional()
	@IsString()
	username?: string

	@ApiProperty({
		description: 'Заблокирован ли пользователь',
		default: false
	})
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	isBaned?: boolean

	@ApiProperty({
		description: 'Подтвержден ли пользователь',
		default: false
	})
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	isVerified?: boolean

	@ApiProperty({
		description: 'Реферальный код',
		example: 'ABC123'
	})
	@IsString()
	refCode: string

	@ApiProperty({
		description: 'Роль пользователя',
		enum: UserRole,
		example: UserRole.creator
	})
	@IsEnum(UserRole)
	role: UserRole

	@ApiProperty({
		description: 'Баланс пользователя',
		example: 100.5
	})
	@IsDecimal()
	@Transform(({ value }) => parseFloat(value))
	balance: Decimal

	@ApiProperty({ description: 'User info', type: UserInfoDto })
	userInfo: UserInfoDto

	@ApiProperty({ description: 'Meta tag', type: MetaTagDto })
	MetaTag: MetaTagDto[]
}

export class UpdateUserRoleDto {
	@ApiProperty({
		description: 'Роль пользователя',
		enum: UserRole
	})
	@IsNotEmpty()
	@IsEnum(UserRole)
	role: UserRole
}

export class UpdateUserAdminDto {
	@ApiProperty({
		description: 'Статус администратора',
		example: true
	})
	@IsNotEmpty()
	@IsBoolean()
	@Transform(({ value }) => value === 'true')
	isAdmin: boolean
}

export class UserPaginationDto {
	@ApiProperty({
		description: 'Список пользователей',
		type: [GetUserDto]
	})
	users: GetUserDto[]

	@ApiProperty({
		description: 'Общее количество пользователей',
		example: 100
	})
	total: number
}
