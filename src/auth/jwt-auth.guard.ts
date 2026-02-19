import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from "@nestjs/config";

/*@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers['authorization'];
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({message: 'Пользователь не авторизован'});
      }

      const user = this.jwtService.verify(token);
      req.user = user;
      return true;

    } catch (e) {
      throw new UnauthorizedException({message: 'Пользователь не авторизован'});
    }
  }
}*/

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest();

      const token = req.cookies?.access_token;

      if (!token) {
        throw new UnauthorizedException({
          message: "Access token отсутствует",
        });
      }

      const user = this.jwtService.verify(token, {
        secret: this.configService.get("JWT_ACCESS_SECRET"),
      });

      req.user = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: "Пользователь не авторизован",
      });
    }
  }
}
