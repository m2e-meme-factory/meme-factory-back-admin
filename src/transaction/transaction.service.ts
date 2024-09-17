import {
	Injectable,
	NotFoundException,
	InternalServerErrorException,
	BadRequestException
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { FilterTransactionDto } from './dto/filters-transaction.dto'
import { Prisma } from '@prisma/client'

@Injectable()
export class TransactionService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createTransactionDto: CreateTransactionDto) {
		try {
			return await this.prisma.transaction.create({
				data: createTransactionDto
			})
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new BadRequestException(
						'Transaction with this data already exists'
					)
				}
			}
			throw new InternalServerErrorException('Error creating transaction')
		}
	}

	async findAll(filterTransactionDto: FilterTransactionDto) {
		const {
			projectId,
			taskId,
			fromUserId,
			toUserId,
			amountFrom,
			amountTo,
			type,
			sortBy = ['id'],
			sortOrder,
			page = 1,
			limit = 10
		} = filterTransactionDto

		const where: any = {}

		if (projectId !== undefined) {
			where.projectId = projectId
		}

		if (taskId !== undefined) {
			where.taskId = taskId
		}

		if (fromUserId !== undefined) {
			where.fromUserId = fromUserId
		}

		if (toUserId !== undefined) {
			where.toUserId = toUserId
		}

		if (amountFrom !== undefined || amountTo !== undefined) {
			where.amount = {}
			if (amountFrom !== undefined) {
				where.amount.gte = amountFrom
			}
			if (amountTo !== undefined) {
				where.amount.lte = amountTo
			}
		}

		if (type !== undefined) {
			where.type = type
		}

		const sortByArray = Array.isArray(sortBy) ? sortBy : [sortBy]
		const sortOrderArray = Array.isArray(sortOrder)
			? sortOrder
			: [sortOrder]

		const orderBy = sortByArray.map((field, index) => ({
			[field]: sortOrderArray?.[index] || 'asc'
		}))

		try {
			const [transactions, total] = await Promise.all([
				this.prisma.transaction.findMany({
					where,
					orderBy,
					skip: (page - 1) * limit,
					take: limit
				}),
				this.prisma.transaction.count({ where })
			])

			return {
				total,
				transactions
			}
		} catch (error) {
			throw new InternalServerErrorException(
				'Error fetching transactions'
			)
		}
	}

	async findOne(id: number) {
		try {
			const transaction = await this.prisma.transaction.findUnique({
				where: { id }
			})
			if (!transaction) {
				throw new NotFoundException(
					`Transaction with ID ${id} not found`
				)
			}
			return transaction
		} catch (error) {
			throw new InternalServerErrorException(
				`Error fetching transaction: ${error}`
			)
		}
	}

	async update(id: number, updateTransactionDto: UpdateTransactionDto) {
		try {
			return await this.prisma.transaction.update({
				where: { id },
				data: updateTransactionDto
			})
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(
						`Transaction with ID ${id} not found`
					)
				}
			}
			throw new InternalServerErrorException(
				`Error updating transaction: ${error}`
			)
		}
	}

	async remove(id: number) {
		try {
			return await this.prisma.transaction.delete({
				where: { id }
			})
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new NotFoundException(
						`Transaction with ID ${id} not found`
					)
				}
			}
			throw new InternalServerErrorException(
				`Error deleting transaction: ${error}`
			)
		}
	}
}
