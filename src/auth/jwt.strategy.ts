import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { TokenService } from './token/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
      passReqToCallback: true
    });
  }

  async validate(request: Request, payload: {sub: number, username: string, role: string}) {

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if(token && await this.tokenService.isTokenRevoked(token)){
      throw new UnauthorizedException("User logged out already");
    }

    const user = await this.userService.findOne(payload.sub);
    if(!user){
      throw new UnauthorizedException("Invalid Token");
    }
    console.log({userId: payload.sub, username: payload.username, role: payload.role});
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}