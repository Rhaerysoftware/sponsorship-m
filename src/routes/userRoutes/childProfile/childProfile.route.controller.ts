import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/database/user';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { IUserCookie } from 'shared/types';
import ChildProfileRouteService from 'src/routes/userRoutes/childProfile/childProfile.route.service';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';

@Controller('user/childProfile')
@UseInterceptors(new CookieInterceptor(Role.User))
export default class ChildProfileRouteController {
  constructor(private childProfileRouteService: ChildProfileRouteService) {}

  @Get('getChildPofile/:childId')
  public async GetChildProfile(
    @Param('childId', ParseIntPipe) childId: number,
    @User(Role.User) user: IUserCookie,
  ) {
    const profile = await this.childProfileRouteService.getChildProfile(
      childId,
      user,
    );

    return { ok: true, message: 'Child profile', data: profile };
  }

  @Get('getFixNeeds/:childId')
  public async GetChildSponsorableFixNeeds(
    @Param('childId', ParseIntPipe) childId: number,
    @User(Role.User) user: IUserCookie,
  ) {
    const fixNeeds = await this.childProfileRouteService.getFixNeeds(
      childId,
      user,
    );

    return { ok: true, message: 'f', data: fixNeeds };
  }

  @Get('sponsorToChild/:fixNeedId')
  public async SponsorToChild(
    @Param('fixNeedId') fixNeedId: number,
    @User(Role.User) user: IUserCookie,
  ) {
    const sponosorship = await this.childProfileRouteService
      .sponsorToChild(user, fixNeedId)
      .catch((err) => console.log('ERRORRROROROROROOROOROROR', err));

    return { ok: true, message: 'w', data: sponosorship };
  }
}
