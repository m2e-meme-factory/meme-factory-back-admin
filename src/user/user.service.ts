// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'
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
			sortBy = ['id'],
			sortOrder = ['asc']
		} = filterDto

		const where = search
			? {
					OR: [
						{ name: { contains: search, mode: 'insensitive' } },
						{ id: { equals: parseInt(search, 10) } },
						{
							description: {
								contains: search,
								mode: 'insensitive'
							}
						}
					]
				}
			: {}

		const skip = (page - 1) * limit
		const take = limit

		const orderBy = sortBy.map((field, index) => ({
			[field]: sortOrder[index] || 'asc'
		}))

		const [data, total] = await this.prisma.$transaction([
			this.prisma.user.findMany({
				where,
				skip,
				take,
				orderBy
			}),
			this.prisma.user.count({ where })
		])

		return { data, total }
	}

	async findOne(id: number): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { id } })
		if (!user) {
			throw new NotFoundException(`User with ID ${id} not found`)
		}
		return user
	}

	async update(id: number, data: UpdateUserDto): Promise<User> {
		return this.prisma.user.update({ where: { id }, data })
	}

	async remove(id: number): Promise<User> {
		return this.prisma.user.delete({ where: { id } })
	}
}
