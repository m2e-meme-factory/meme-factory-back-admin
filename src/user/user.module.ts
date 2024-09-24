import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminActionLogService } from 'src/admin-action-log/admin-action-log.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, AdminActionLogService],
})
export class UserModule {}
