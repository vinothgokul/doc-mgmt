import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  userRegister(@Body(ValidationPipe) registerUserDto: RegisterUserDto){
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  userLogin(@Body(ValidationPipe) loginUserDto: LoginUserDto){
    return this.authService.loginUser(loginUserDto);
  }

  @Get('logout')
  userLogout(){
    return 'User logged out successfully';
  }
}
