import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminActionLogService } from 'src/admin-action-log/admin-action-log.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, AdminActionLogService],
})
export class TransactionModule {}
