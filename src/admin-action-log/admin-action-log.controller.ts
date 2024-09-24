import { Controller, Get } from '@nestjs/common'
import { AdminActionLogService } from './admin-action-log.service'
import { AdminActionLog } from '@prisma/client'
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags
} from '@nestjs/swagger'
import { AdminActionLogDto } from './dto/admin-action-log.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'

@ApiTags('Admin Action Logs')
@ApiBearerAuth('access_token')
@Controller('admin-action-logs')
export class AdminActionLogController {
	constructor(
		private readonly adminActionLogService: AdminActionLogService
	) {}
	@ApiOperation({ summary: 'Get all admin action logs' })
	@ApiResponse({
		status: 200,
		description: 'Admin action logs retrieved successfully',
		type: [AdminActionLogDto]
	})
	@Get()
	@Auth('admin')
	async getAll(): Promise<AdminActionLog[]> {
		return this.adminActionLogService.getAll()
	}
}
