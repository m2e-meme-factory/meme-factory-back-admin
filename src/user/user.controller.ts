// src/user/user.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'The user has been successfully created.', type: CreateUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Auth('admin')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Return all users', type: [CreateUserDto] })
  @Auth('admin')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Return user by ID', type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth('admin')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.', type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth('admin')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.', type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Auth('admin')
  async remove(@Param('id') id: number): Promise<User> {
    return this.userService.remove(id);
  }
}
