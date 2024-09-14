// src/user/user.controller.ts
import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Patch,
	Query,
	ParseIntPipe,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { User, UserAdmin, UserRole } from '@prisma/client'
import { ApiTags, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger'
import { CreateUserDto, GetUserDto, UpdateUserAdminDto, UpdateUserDto, UpdateUserRoleDto, UserPaginationDto } from './dto/user.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { FilterUserDto } from './dto/filter-user.dto'

@ApiBearerAuth('access-token')
@ApiTags('users')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@ApiResponse({
		status: 201,
		description: 'The user has been successfully created.',
		type: CreateUserDto
	})
	@ApiResponse({ status: 400, description: 'Bad Request' })
	@Auth('admin')
	async create(@Body() createUserDto: CreateUserDto): Promise<User> {
		return this.userService.create(createUserDto)
	}

	@Get()
	@ApiResponse({
		status: 200,
		description: 'Return all users with pagination, sorting, and filtering',
		type: [UserPaginationDto]
	})
	@Auth('admin')
	@UsePipes(new ValidationPipe({ transform: true }))
	async findAll(
		@Query() filterDto: FilterUserDto
	): Promise<{ data: GetUserDto[]; total: number }> {
		return this.userService.findAll(filterDto)
	}

	@Get(':id')
	@ApiResponse({
		status: 200,
		description: 'Return user by ID',
		type: CreateUserDto
	})
	@ApiResponse({ status: 404, description: 'User not found' })
	@Auth('admin')
	async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.userService.findOne(id)
	}

	@Patch(':id')
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully updated.',
		type: CreateUserDto
	})
	@ApiResponse({ status: 404, description: 'User not found' })
	@Auth('admin')
	@UsePipes(new ValidationPipe({transform: true}))
	async update(
		@Param('id') id: number,
		@Body() updateUserDto: UpdateUserDto
	): Promise<User> {
		return this.userService.update(id, updateUserDto)
	}

	@Put(':id/ban')
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully banned.',
		type: CreateUserDto
	})
	@ApiResponse({ status: 404, description: 'User not found' })
	@Auth('admin')
	async ban(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.userService.ban(id)
	}
	@Put(':id/unban')
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully unbanned.',
		type: CreateUserDto
	})
	@ApiResponse({ status: 404, description: 'User not found' })
	@Auth('admin')
	async unban(@Param('id', ParseIntPipe) id: number): Promise<User> {
		return this.userService.unban(id)
	}

	@Put(':id/role')
	@ApiOperation({ summary: 'Изменить роль пользователя' })
	@ApiParam({ name: 'id', description: 'ID пользователя' })
	@ApiBody({ type: UpdateUserRoleDto })
	@ApiResponse({
		status: 200,
		description: 'Роль пользователя успешно обновлена.',
		schema: {
			example: {
				id: 1,
				telegramId: '1234567',
				username: '1234567',
				role: UserRole.creator,
				balance: 0,
				isBaned: false,
				isVerified: true,
				createdAt: '2024-07-31T15:19:16.000Z',
				inviterRefCode: null,
				refCode: '1234567'
			}
		}
	})
	@ApiResponse({ status: 400, description: 'Неверные данные запроса.' })
	@ApiResponse({ status: 404, description: 'Пользователь не найден.' })
	@ApiResponse({ status: 403, description: 'Доступ запрещен.' })
	@Auth('admin')
	async updateUserRole(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserRoleDto: UpdateUserRoleDto
	): Promise<User> {
		return this.userService.updateUserRole(id, updateUserRoleDto.role)
	}
	
	@Put(':id/is-admin')
	@ApiOperation({ summary: 'Изменить роль для админа' })
	@ApiParam({ name: 'id', description: 'ID user admin' })
	@ApiBody({ type: UpdateUserAdminDto })
	@ApiResponse({
		status: 200,
		description: 'Роль админа успешно обновлена.',
		schema: {
			example: {
				id: 1,
				email: 'email@mail.ru',
				password: 'hash',
				isAdmin: true,
				createdAt: '2024-07-31T15:19:16.000Z',
				updatedAt: '2024-07-31T15:19:16.000Z',
			}
		}
	})
	@ApiResponse({ status: 400, description: 'Неверные данные запроса.' })
	@ApiResponse({ status: 404, description: 'Пользователь не найден.' })
	@ApiResponse({ status: 403, description: 'Доступ запрещен.' })
	// @Auth('admin')
	async updateUserAdmin(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserAdminDto: UpdateUserAdminDto
	): Promise<UserAdmin> {
		return this.userService.updateUserAdmin(id, updateUserAdminDto.isAdmin)
	}
}
