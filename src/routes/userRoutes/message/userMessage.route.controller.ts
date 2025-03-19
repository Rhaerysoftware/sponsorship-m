import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Role } from 'src/database/user';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { IUserCookie } from 'shared/types';
import UserMessageRotueService from 'src/routes/userRoutes/message/userMessage.route.service';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';

@UseInterceptors(new CookieInterceptor(Role.User))
@Controller('user/message')
export default class UserMessageRouteController {
  constructor(private userMessageRouteService: UserMessageRotueService) {}

  @Get('getConversations')
  public async GetUserConversations(@User(Role.User) user: IUserCookie) {
    const conversations =
      await this.userMessageRouteService.getConversations(user);

    return { ok: true, message: 'Retrieved', data: conversations };
  }
}
