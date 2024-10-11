import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { TransactionModule } from './transaction/transaction.module'
import { ProjectModule } from './project/project.module';
import { ProgressProjectModule } from './progress-project/progress-project.module';
import { UserModule } from './user/user.module';
import { AutoTaskModule } from './auto-task/auto-task.module';
import { AdminActionLogService } from './admin-action-log/admin-action-log.service';
import { AdminActionLogModule } from './admin-action-log/admin-action-log.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
	imports: [AuthModule, PrismaModule, TransactionModule, ProjectModule, ProgressProjectModule, UserModule, AutoTaskModule, AdminActionLogModule],
	providers: [AdminActionLogService, PrismaService]
})
export class AppModule {}
