// src/user/dto/create-user.dto.ts
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDecimal, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ description: 'Telegram ID пользователя', example: '123456789' })
  @IsNotEmpty()
  @IsString()
  telegramId: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'example_user' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Заблокирован ли пользователь', default: false })
  @IsBoolean()
  isBaned?: boolean;

  @ApiProperty({ description: 'Подтвержден ли пользователь', default: false })
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ description: 'Реферальный код', example: 'ABC123' })
  @IsNotEmpty()
  @IsString()
  refCode: string;

  @ApiProperty({ description: 'Роль пользователя', enum: UserRole, default: UserRole.creator })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ description: 'Баланс пользователя', default: 0 })
  @IsOptional()
  @IsDecimal()
  balance?: number;
}


export class UpdateUserDto extends PartialType(CreateUserDto) {}