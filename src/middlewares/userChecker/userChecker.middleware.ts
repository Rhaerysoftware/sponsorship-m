import { NestMiddleware, Injectable } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { ExtendedRequest } from 'shared/types';
import { AuthorizationError } from 'src/utils/error';
import UserService from 'src/modules/userModule/userModule/user.service';

@Injectable()
export default class UserCheckerMiddleware implements NestMiddleware {
  private userService: UserService;

  public async use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const { user } = req;

    if (!user) throw new AuthorizationError();

    const actor = await this.userService.getUser(
      { userId: user.userId },
      user.role,
    );

    if (!actor) throw new AuthorizationError();

    next();
  }
}
