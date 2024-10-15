import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common'
import { Prisma, User, UserAdmin, UserRole } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto, GetUserDto, UpdateUserDto } from './dto/user.dto'
import { FilterUserDto } from './dto/filter-user.dto'
import { Observer } from 'src/observer/observer.interface'
import { AdminActionLogService } from 'src/admin-action-log/admin-action-log.service'

@Injectable()
export class UserService {
	private observers: Observer[] = []

	constructor(
		private readonly prisma: PrismaService,
		private readonly adminActionLogService: AdminActionLogService
	) {
		this.attach(adminActionLogService)
	}

	attach(observer: Observer): void {
		this.observers.push(observer)
	}

	detach(observer: Observer): void {
		const index = this.observers.indexOf(observer)
		if (index > -1) {
			this.observers.splice(index, 1)
		}
	}


	getPrisma() {
		return this.prisma
	}

	notify(action: string, details: any): void {
		for (const observer of this.observers) {
			observer.update(action, details)
		}
	}

	async create(data: CreateUserDto, adminId: number): Promise<User> {
		try {
			const newUser = await this.prisma.user.create({ data })

			this.notify('create', {
				action: 'CREATE_USER',
				entityType: 'User',
				entityId: newUser.id,
				newData: newUser,
				adminId
			})

			return newUser
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ConflictException(
						'User with this data already exists'
					)
				}
			}
			throw new InternalServerErrorException('Error creating user')
		}
	}

	async findAll(
		filterDto: FilterUserDto
	): Promise<{ data: GetUserDto[]; total: number }> {
		const {
			search,
			page = 1,
			limit = 10,
			sortBy = 'id',
			sortOrder = 'asc',
			isBanned,
			isVerified,
			refCode,
			role
		} = filterDto

		const where: any = {
			...(search && {
				OR: [
					{
						username: {
							contains: search,
							mode: 'insensitive' as const
						}
					},
					{
						MetaTag: {
							some: {
								tag: {
									contains: search,
									mode: 'insensitive' as const
								}
							}
						}
					}
				]
			}),
			...(isBanned !== undefined && { isBanned }),
			...(isVerified !== undefined && { isVerified }),
			...(refCode && {
				refCode: { contains: refCode, mode: 'insensitive' }
			}),
			...(role && { role })
		}

		const skip = (parseInt(page.toString()) - 1) * limit
		const take = parseInt(limit.toString())

		const sortByArray = Array.isArray(sortBy) ? sortBy : [sortBy]
		const sortOrderArray = Array.isArray(sortOrder)
			? sortOrder
			: [sortOrder]

		const orderBy = sortByArray.map((field, index) => ({
			[field]: sortOrderArray[index] === 'desc' ? 'desc' : 'asc'
		}))

		try {
			const [data, total] = await this.prisma.$transaction([
				this.prisma.user.findMany({
					where,
					skip,
					take,
					orderBy,
					include: {
						userInfo: true,
						MetaTag: true
					}
				}),
				this.prisma.user.count({ where })
			])

			return { data, total }
		} catch (error) {
			console.error(`Error fetching users: ${error}`)
			throw new InternalServerErrorException('Unable to fetch users')
		}
	}

	async findOne(id: number): Promise<User> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id },
				include: { userInfo: true }
			})
			if (!user) {
				throw new NotFoundException(`User with ID ${id} not found`)
			}
			return user
		} catch (error) {
			throw new InternalServerErrorException(
				`Error fetching user: ${error}`
			)
		}
	}

	async update(id: number, data: UpdateUserDto, adminId: number): Promise<User> {
		try {
			const oldUser = await this.prisma.user.findUnique({ where: { id } })
			if (!oldUser) {
				throw new NotFoundException(`User with ID ${id} not found`)
			}

			const updatedUser = await this.prisma.user.update({ where: { id }, data })

			this.notify('update', {
				action: 'UPDATE_USER',
				entityType: 'User',
				entityId: updatedUser.id,
				oldData: oldUser,
				newData: updatedUser,
				adminId
			})

			return updatedUser
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`User with ID ${id} not found`)
				}
			}
			throw new InternalServerErrorException(
				`Error updating user: ${error}`
			)
		}
	}

	async ban(id: number, adminId: number): Promise<User> {
		try {
			const oldUser = await this.prisma.user.findUnique({ where: { id } })
			if (!oldUser) {
				throw new NotFoundException(`User with ID ${id} not found`)
			}

			const bannedUser = await this.prisma.user.update({
				where: { id },
				data: { isBaned: true }
			})

			this.notify('update', {
				action: 'BAN_USER',
				entityType: 'User',
				entityId: bannedUser.id,
				oldData: oldUser,
				newData: bannedUser,
				adminId
			})

			return bannedUser
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`User with ID ${id} not found`)
				}
			}
			throw new InternalServerErrorException(
				`Error banning user: ${error}`
			)
		}
	}

	async unban(id: number, adminId: number): Promise<User> {
		try {
			const oldUser = await this.prisma.user.findUnique({ where: { id } })
			if (!oldUser) {
				throw new NotFoundException(`User with ID ${id} not found`)
			}

			const unbannedUser = await this.prisma.user.update({
				where: { id },
				data: { isBaned: false }
			})

			this.notify('update', {
				action: 'UNBAN_USER',
				entityType: 'User',
				entityId: unbannedUser.id,
				oldData: oldUser,
				newData: unbannedUser,
				adminId
			})

			return unbannedUser
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`User with ID ${id} not found`)
				}
			}
			throw new InternalServerErrorException(
				`Error unbanning user: ${error}`
			)
		}
	}

	async updateUserRole(id: number, role: UserRole, adminId: number): Promise<User> {
		try {
			const oldUser = await this.prisma.user.findUnique({ where: { id } })
			if (!oldUser) {
				throw new NotFoundException(`User with ID ${id} not found`)
			}

			const updatedUser = await this.prisma.user.update({
				where: { id },
				data: { role }
			})

			this.notify('update', {
				action: 'UPDATE_USER_ROLE',
				entityType: 'User',
				entityId: updatedUser.id,
				oldData: oldUser,
				newData: updatedUser,
				adminId
			})

			return updatedUser
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`User with ID ${id} not found`)
				}
			}
			throw new InternalServerErrorException(
				`Error updating user role: ${error}`
			)
		}
	}

	async updateUserAdmin(id: number, isAdmin: boolean, adminId: number): Promise<UserAdmin> {
		try {
			const oldUserAdmin = await this.prisma.userAdmin.findUnique({ where: { id } })
			if (!oldUserAdmin) {
				throw new NotFoundException(`Admin with ID ${id} not found`)
			}

			const updatedUserAdmin = await this.prisma.userAdmin.update({
				where: { id },
				data: { isAdmin }
			})

			this.notify('update', {
				action: 'UPDATE_USER_ADMIN',
				entityType: 'UserAdmin',
				entityId: updatedUserAdmin.id,
				oldData: oldUserAdmin,
				newData: updatedUserAdmin,
				adminId
			})

			return updatedUserAdmin
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`Admin with ID ${id} not found`)
				}
			}
			throw new InternalServerErrorException(
				`Error updating admin role: ${error}`
			)
		}
	}
}
