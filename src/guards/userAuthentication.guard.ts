import { Role } from './../database/user/index';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IUserCookie } from 'shared/types';
import { AuthorizationError } from 'src/utils/error';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private roles: Role[] | Role) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const cookies = request.cookies;

      let authCookie: IUserCookie;

      if (Array.isArray(this.roles)) {
        for (const role of this.roles) {
          const cookieProperty = role + 'Authorization';
          if (cookies[cookieProperty]) {
            authCookie = cookies[cookieProperty];
            break;
          }
        }
      } else {
        authCookie = cookies[this.roles + 'Authorization'];
      }

      if (!authCookie) throw new AuthorizationError();
      if (
        !this.roles.includes(authCookie.role) ||
        authCookie.role !== this.roles
      )
        return false;

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
