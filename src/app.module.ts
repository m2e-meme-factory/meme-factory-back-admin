import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { TransactionModule } from './transaction/transaction.module'
import { ProjectModule } from './project/project.module';
import { ProgressProjectModule } from './progress-project/progress-project.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [AuthModule, PrismaModule, TransactionModule, ProjectModule, ProgressProjectModule, UserModule]
})
export class AppModule {}
