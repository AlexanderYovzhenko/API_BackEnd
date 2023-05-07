import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles_auth_decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const request = context.switchToHttp().getRequest();
      const autHeader = request.headers.authorization || request.headers.header;
      const [type, token] = autHeader.split(' ');

      // check has token and type token
      if (type !== 'Bearer' || !token) {
        throw new ForbiddenException({
          message: 'permission denied',
        });
      }

      // check is correct token
      const user = this.jwtService.verify(token);
      request.user = user;

      // check if the user has role for permission to access the resource
      return user.roles.some((role: { value: string }) =>
        requiredRoles.includes(role.value),
      );
    } catch (error) {
      throw new ForbiddenException({
        message: 'permission denied',
      });
    }
  }
}
