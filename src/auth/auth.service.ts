import {
    Injectable,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { PrismaService } from '../prisma/prisma.service';
  import { genSalt, hash, compare } from 'bcryptjs';
  import { AuthDto } from './dto/auth.dto';
  import { RefreshTokenDto } from './dto/refreshToken.dto';
  import { UserAdmin } from '@prisma/client';
  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly prisma: PrismaService,
      private readonly jwtService: JwtService,
    ) {}
  
    async login({ email, password }: AuthDto) {
      const userAdmin = await this.validateUserAdmin(email, password);
  
      const tokens = await this.issueTokenPair(String(userAdmin.id));
  
      return {
        userAdmin: this.returnUserAdminFields(userAdmin),
        ...tokens,
      };
    }
  
    async register({ email, password }: AuthDto) {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
  
      const newUserAdmin = await this.prisma.userAdmin.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
  
      const tokens = await this.issueTokenPair(String(newUserAdmin.id));
  
      return {
        userAdmin: this.returnUserAdminFields(newUserAdmin),
        ...tokens,
      };
    }
  
    async getNewTokens({ refreshToken }: RefreshTokenDto) {
      if (!refreshToken) throw new UnauthorizedException('Please sign in!');
  
      const result = await this.jwtService.verifyAsync(refreshToken);
  
      if (!result) throw new UnauthorizedException('Invalid token or expired!');
  
      const userAdmin = await this.prisma.userAdmin.findUnique({
        where: { id: result._id },
      });
  
      if (!userAdmin) throw new ForbiddenException('UserAdmin not found!');
  
      const tokens = await this.issueTokenPair(String(userAdmin.id));
  
      return {
        userAdmin: this.returnUserAdminFields(userAdmin),
        ...tokens,
      };
    }
  
    async findByEmail(email: string) {
      return this.prisma.userAdmin.findUnique({
        where: { email },
      });
    }
  
    async validateUserAdmin(email: string, password: string): Promise<UserAdmin> {
      const userAdmin = await this.findByEmail(email);
      if (!userAdmin) throw new UnauthorizedException('UserAdmin not found');
  
      const isValidPassword = await compare(password, userAdmin.password);
      if (!isValidPassword) throw new UnauthorizedException('Invalid password');
  
      return userAdmin;
    }
  
    async issueTokenPair(userAdminId: string) {
      const data = { _id: userAdminId };
  
      const refreshToken = await this.jwtService.signAsync(data, {
        expiresIn: '15d',
      });
  
      const accessToken = await this.jwtService.signAsync(data, {
        expiresIn: '1h',
      });
  
      return { refreshToken, accessToken };
    }
  
    returnUserAdminFields(userAdmin: UserAdmin) {
      return {
        id: userAdmin.id,
        email: userAdmin.email,
        isAdmin: userAdmin.isAdmin,
      };
    }
  }
  