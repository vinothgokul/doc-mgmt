import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if(!roles)
      return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log("user :",user)
    console.log("Res :",roles.some(role => user?.role?.includes(role)))
    return roles.some(role => user?.role?.includes(role))
  }
}
