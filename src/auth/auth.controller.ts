import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@ApiBearerAuth('access-token')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiBody({ type: AuthDto, description: 'Данные для входа (email и пароль)' }) 
  @ApiResponse({ status: 200, description: 'Успешная авторизация', type: AuthResponseDto }) 
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/access-token')
  @ApiOperation({ summary: 'Получение нового access/refresh токенов' })
  @ApiBody({ type: RefreshTokenDto, description: 'Токен для обновления (refresh token)' }) 
  @ApiResponse({ status: 200, description: 'Токены успешно обновлены', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Неверный или просроченный refresh-токен' })
  async getNewTokens(@Body() data: RefreshTokenDto) {
    return this.authService.getNewTokens(data);
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: AuthDto, description: 'Данные для регистрации (email и пароль)' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован', type: AuthResponseDto }) 
  @ApiResponse({ status: 400, description: 'Пользователь с таким email уже существует' })
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findByEmail(dto.email);
    if (oldUser) {
      throw new BadRequestException('User with this email is already in the system');
    }

    return this.authService.register(dto);
  }
}
