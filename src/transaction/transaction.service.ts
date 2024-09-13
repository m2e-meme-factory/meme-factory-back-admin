import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { FilterTransactionDto } from './dto/filters-transaction.dto'

@Injectable()
export class TransactionService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createTransactionDto: CreateTransactionDto) {
		return this.prisma.transaction.create({
			data: createTransactionDto
		})
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

		const orderBy = sortByArray?.map((field, index) => ({
			[field]: sortOrderArray?.[index] || 'asc'
		}))

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
	}

	async findOne(id: number) {
		return this.prisma.transaction.findUnique({
			where: { id }
		})
	}

	async update(id: number, updateTransactionDto: UpdateTransactionDto) {
		return this.prisma.transaction.update({
			where: { id },
			data: updateTransactionDto
		})
	}

	async remove(id: number) {
		return this.prisma.transaction.delete({
			where: { id }
		})
	}
}
