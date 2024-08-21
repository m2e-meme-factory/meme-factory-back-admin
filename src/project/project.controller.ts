import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Создать проект' })
  @ApiResponse({ status: 201, description: 'Проект успешно создан.', type: CreateProjectDto })
  @ApiResponse({ status: 400, description: 'Неверные данные.' })
  @Auth('admin')
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все проекты' })
  @ApiResponse({ status: 200, description: 'Список проектов.', type: [CreateProjectDto] })
  @Auth('admin')
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить проект по ID' })
  @ApiResponse({ status: 200, description: 'Найден проект.', type: CreateProjectDto })
  @ApiResponse({ status: 404, description: 'Проект не найден.' })
  @Auth('admin')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить проект' })
  @ApiResponse({ status: 200, description: 'Проект обновлен.', type: CreateProjectDto })
  @ApiResponse({ status: 404, description: 'Проект не найден.' })
  @Auth('admin')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить проект' })
  @ApiResponse({ status: 204, description: 'Проект успешно удален.' })
  @ApiResponse({ status: 404, description: 'Проект не найден.' })
  @Auth('admin')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
