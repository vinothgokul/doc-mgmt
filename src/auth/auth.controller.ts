import { Body, Controller, Request, Get, Post, ValidationPipe, UnauthorizedException, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from './token/token.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}))
  async userRegister(@Body() registerUserDto: RegisterUserDto){
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  async userLogin(@Body(ValidationPipe) loginUserDto: LoginUserDto){
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
