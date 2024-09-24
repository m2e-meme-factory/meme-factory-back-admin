import { Controller } from '@nestjs/common';
import { AdminActionLogService } from './admin-action-log.service';

@Controller('admin-action-log')
export class AdminActionLogController {
  constructor(private readonly adminActionLogService: AdminActionLogService) {}
}
