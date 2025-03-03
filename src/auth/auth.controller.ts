import { Body, Controller, Request, Get, Post, ValidationPipe, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { TokenService } from './token/token.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private tokenService: TokenService
  ) {}

  @Post('register')
  async userRegister(@Body(ValidationPipe) registerUserDto: Prisma.UserCreateInput){
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  async userLogin(@Body(ValidationPipe) loginUserDto: Prisma.UserCreateInput){
    return this.authService.loginUser(loginUserDto);
  }

  @Post('logout')
  userLogout(@Request() req: any){
    const token = req.headers.authorization.split(' ')[1];
    if(!token)
      throw new UnauthorizedException('User not logged in');
    this.tokenService.revokeToken(token);
    return {
      message: 'User logged out successfully'
    }
  }
}
