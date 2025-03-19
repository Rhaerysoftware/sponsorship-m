import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from 'src/database/user';
import { IUserCookie } from 'shared/types';
import { AuthorizationError, ServerError } from 'src/utils/error';

export const User = createParamDecorator(
  (role: Role, ctx: ExecutionContext) => {
    if (!role) throw new Error('Yok Ayılma Payı Bana Yok Ayılma Payı');

    const { user } = ctx.switchToHttp().getRequest();

    console.log('USER REQ', user);

    if (!user || user.role !== role) throw new AuthorizationError();
    if (!user.role) throw new ServerError('Cookie is problematic');

    return user as IUserCookie;
  },
);
