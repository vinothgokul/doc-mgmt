import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { TokenService } from './token/token.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '60m' }
    }),
    PassportModule,
    DatabaseModule],
  providers: [AuthService, UserService, JwtStrategy, TokenService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
