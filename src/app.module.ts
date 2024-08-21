import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { TransactionModule } from './transaction/transaction.module'
import { ProjectModule } from './project/project.module';

@Module({
	imports: [AuthModule, PrismaModule, TransactionModule, ProjectModule]
})
export class AppModule {}
