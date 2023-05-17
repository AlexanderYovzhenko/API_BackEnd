import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const autHeader = request.headers.authorization || request.headers.header;
      const [type, token] = autHeader.split(' ');

      // check has token and type token
      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'user unauthorized',
        });
      }

      const jwtSecretAccessKey = this.configService.get(
        'JWT_SECRET_ACCESS_KEY',
      );

      // check is correct token
      const user = this.jwtService.verify(token, {
        secret: jwtSecretAccessKey,
      });
      request.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'user unauthorized',
      });
    }
  }
}
