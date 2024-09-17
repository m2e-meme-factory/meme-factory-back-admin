import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	ConflictException
} from '@nestjs/common';
import { Prisma, User, UserAdmin, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto, GetUserDto, UpdateUserDto } from './dto/user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateUserDto): Promise<User> {
		try {
			return await this.prisma.user.create({ data });
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ConflictException('User with this data already exists');
				}
			}
			throw new InternalServerErrorException('Error creating user');
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
		} = filterDto;

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
		};

		const skip = (parseInt(page.toString()) - 1) * limit;
		const take = parseInt(limit.toString());

		const sortByArray = Array.isArray(sortBy) ? sortBy : [sortBy];
		const sortOrderArray = Array.isArray(sortOrder)
			? sortOrder
			: [sortOrder];

		const orderBy = sortByArray.map((field, index) => ({
			[field]: sortOrderArray[index] === 'desc' ? 'desc' : 'asc'
		}));

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
			]);

			return { data, total };
		} catch (error) {
			console.error(`Error fetching users: ${error}`);
			throw new InternalServerErrorException('Unable to fetch users');
		}
	}

	async findOne(id: number): Promise<User> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id },
				include: { userInfo: true }
			});
			if (!user) {
				throw new NotFoundException(`User with ID ${id} not found`);
			}
			return user;
		} catch (error) {
			throw new InternalServerErrorException(`Error fetching user: ${error}`);
		}
	}

	async update(id: number, data: UpdateUserDto): Promise<User> {
		try {
			return await this.prisma.user.update({ where: { id }, data });
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`User with ID ${id} not found`);
				}
			}
			throw new InternalServerErrorException(`Error updating user: ${error}`);
		}
	}

	async ban(id: number): Promise<User> {
		try {
			return await this.prisma.user.update({
				where: { id },
				data: {
					isBaned: true
				}
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`User with ID ${id} not found`);
				}
			}
			throw new InternalServerErrorException(`Error banning user: ${error}`);
		}
	}

	async unban(id: number): Promise<User> {
		try {
			return await this.prisma.user.update({
				where: { id },
				data: {
					isBaned: false
				}
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`User with ID ${id} not found`);
				}
			}
			throw new InternalServerErrorException(`Error unbanning user: ${error}`);
		}
	}

	async updateUserRole(id: number, role: UserRole): Promise<User> {
		try {
			const user = await this.prisma.user.update({
				where: { id },
				data: { role }
			});
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`User with ID ${id} not found`);
				}
			}
			throw new InternalServerErrorException(`Error updating user role: ${error}`);
		}
	}

	async updateUserAdmin(id: number, isAdmin: boolean): Promise<UserAdmin> {
		try {
			const user = await this.prisma.userAdmin.update({
				where: { id },
				data: { isAdmin }
			});
			return user;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(`Admin with ID ${id} not found`);
				}
			}
			throw new InternalServerErrorException(`Error updating admin role: ${error}`);
		}
	}
}
