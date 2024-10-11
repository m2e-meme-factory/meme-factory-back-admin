import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator'

export class AuthDto {
	@ApiProperty({ example: "email@mail.ru", description: 'Email пользователя' })
	@IsString()
	email: string

	@MinLength(6, { message: 'Password cannot be less than 6 characters' })
	@IsString()
	@ApiProperty({ example: "password", description: 'Password пользователя' })
	password: string
}

export class UserAdminDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  email: string;

  @ApiProperty({ example: true, description: 'Является ли пользователь администратором' })
  isAdmin: boolean;
}

export class AuthResponseDto {
	@ApiProperty({ type: UserAdminDto, description: 'Данные пользователя' })
	userAdmin: UserAdminDto;
  
	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Access токен' })
	accessToken: string;
  
	@ApiProperty({ example: 'dGhlIHNhbXBsZSB0b2tlbg==', description: 'Refresh токен' })
	refreshToken: string;
  }