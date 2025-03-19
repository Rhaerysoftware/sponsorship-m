import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/database/user';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';
import { IUserCookie } from 'shared/types';
import UserSponsorshipManagementRouteService from 'src/routes/userRoutes/sponsorshipManagement/userSponsorshipManagement.route.service';

@UseInterceptors(new CookieInterceptor(Role.User))
@Controller('user/sponsorshipManagement')
export default class UserSponsorshipManagementController {
  constructor(
    private sponsorshipManagementRouteService: UserSponsorshipManagementRouteService,
  ) {}

  @Get('getSponsorships')
  public async GetUserSponsorships(@User(Role.User) user: IUserCookie) {
    const userActiveSponsorships =
      await this.sponsorshipManagementRouteService.getUserActiveSponsorships(
        user,
      );

    return {
      ok: true,
      message: 'Sponsorships Retrieved',
      data: userActiveSponsorships,
    };
  }

  @Delete('deleteSponsorship/:sponsorshipId')
  public async DeleteSponsorship(
    @User(Role.User) user: IUserCookie,
    @Param('sponsorshipId', ParseIntPipe) sponsorshipId: number,
  ) {
    const deletedSponsorship =
      await this.sponsorshipManagementRouteService.deleteSponsorship(
        sponsorshipId,
      );

    return {
      ok: true,
      message: 'Sponsorships Retrieved',
      data: deletedSponsorship,
    };
  }
}
