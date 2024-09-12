// src/user/user.service.ts
import {
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from '@nestjs/common'
import { User, UserAdmin, UserRole } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'
import { FilterUserDto } from './dto/filter-user.dto'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateUserDto): Promise<User> {
		return this.prisma.user.create({ data })
	}

	async findAll(
		filterDto: FilterUserDto
	): Promise<{ data: User[]; total: number }> {
		const {
			search,
			page = 1,
			limit = 10,
			sortBy = 'id',
			sortOrder = 'asc'
		} = filterDto

		const where = search
			? {
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
				}
			: {}

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
			console.error(`Error fetching users: ${error}`, error)
			throw new Error(`Unable to fetch users: ${error}`)
		}
	}

	async findOne(id: number): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: { userInfo: true }
		})
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}
		return user
	}

	async update(id: number, data: UpdateUserDto): Promise<User> {
		return this.prisma.user.update({ where: { id }, data })
	}

	async ban(id: number): Promise<User> {

		return this.prisma.user.update({ where: { id }, data: {
			isBaned: true
		} })
	}
	async unban(id: number): Promise<User> {

		return this.prisma.user.update({ where: { id }, data: {
			isBaned: false
		} })
	}

	async updateUserRole(id: number, role: UserRole): Promise<User> {
		try {
			const user = await this.prisma.user.update({
				where: { id },
				data: { role }
			})

			return user
		} catch (error) {
			throw new InternalServerErrorException(
				`Ошибка при обновлении роли пользователя: ${error}`
			)
		}
	}
	async updateUserAdmin(id: number, isAdmin: boolean): Promise<UserAdmin> {
		try {
			const user = await this.prisma.userAdmin.update({
				where: { id },
				data: { isAdmin }
			})

			return user
		} catch (error) {
			throw new InternalServerErrorException(
				`Ошибка при обновлении роли пользователя: ${error}`
			)
		}
	}
}
