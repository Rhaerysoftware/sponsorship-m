import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/database/user';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { IUserCookie } from 'shared/types';
import ChildMessageRotueService from 'src/routes/childRoutes/message/childMessage.route.service';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';

@Controller('child/message')
@UseInterceptors(new CookieInterceptor(Role.Child))
export default class ChildMessageRouteController {
  constructor(private childMessageRouteService: ChildMessageRotueService) {}

  @Get('getConversations')
  public async GetChildConversations(@User(Role.Child) child: IUserCookie) {
    const conversations =
      await this.childMessageRouteService.getConversations(child);

    return {
      ok: true,
      mesage: 'Retrieved child conversations',
      data: conversations,
    };
  }

  @Post('blockUser/:sponsorshipId')
  public async BlockUser(
    @User(Role.Child) child: IUserCookie,
    @Param('sponsorshipId', ParseIntPipe) sponsorshipId: number,
  ) {
    const blockedSponsorship = await this.childMessageRouteService.blockUser(
      child,
      sponsorshipId,
    );

    return { ok: true, message: 'User Blocked', data: blockedSponsorship };
  }
}
