import {
  Controller,
  Get,
  UseInterceptors,
  Param,
  Delete,
} from '@nestjs/common';
import { Role } from 'src/database/user';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { IUserCookie } from 'shared/types';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';
import SponsorshipManagementRouteService from 'src/routes/authorityRoutes/sponsorshipManagement/sponsorshipManagement.route.service';

@UseInterceptors(new CookieInterceptor(Role.Authority))
@Controller('authority/sponsorshipManagement')
export default class SponsorshipManagementRouteController {
  constructor(
    private sponsorshipManagementRouteService: SponsorshipManagementRouteService,
  ) {}

  @Get('getSponsorship/:sponsorshipId')
  public async GetSponosrship(
    @Param('sponsorshipId') sponosrshipId: number,
    @User(Role.Authority) authority: IUserCookie,
  ) {
    const sponsorship =
      await this.sponsorshipManagementRouteService.getSponsorship(
        authority,
        sponosrshipId,
      );

    return { ok: true, message: 'Karagümrük yanıyor', data: sponsorship };
  }
  @Get('getSponsorshipMessages/:sponsorshipId')
  public async GetSponosrshipMessages(
    @Param('sponsorshipId') sponosrshipId: number,
    @User(Role.Authority) authority: IUserCookie,
  ) {
    const sponsorship =
      await this.sponsorshipManagementRouteService.getSponsorshipMessages(
        authority,
        sponosrshipId,
      );

    return { ok: true, message: 'Karagümrük yanıyor', data: sponsorship };
  }

  @Delete('blockSponsorship/:sponsorshipId')
  public async BlockSponsorship(@Param('sponsorshipId') sponosrshipId: number) {
    const blockedSponsorship =
      await this.sponsorshipManagementRouteService.blockSponsorship(
        sponosrshipId,
      );

    return {
      ok: true,
      message: 'Sponosrship is blocked',
      data: blockedSponsorship,
    };
  }
}
