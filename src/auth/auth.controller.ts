import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  userRegister(@Body(ValidationPipe) registerUserDto: Prisma.UserCreateInput){
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  userLogin(@Body(ValidationPipe) loginUserDto: Prisma.UserCreateInput){
    return this.authService.loginUser(loginUserDto);
  }

  @Get('users')
  getAllUsers(){
    return this.authService.getAllUsers();
  }

  @Get('logout')
  userLogout(){
    return 'User logged out successfully';
  }
}
