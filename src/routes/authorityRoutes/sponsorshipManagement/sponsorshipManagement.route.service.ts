import { Injectable } from '@nestjs/common';
import SponsorshipService from 'src/modules/sponsorModule/sponsor/sponsorShip.service';
import { IUserCookie } from 'shared/types';

@Injectable()
export default class SponsorshipManagementRouteService {
  constructor(private sponosrshipService: SponsorshipService) {}

  public async getSponsorshipMessages(
    authority: IUserCookie,
    sponosrshipId: number,
  ) {
    return await this.sponosrshipService.getSponsorshipMessages(sponosrshipId);
  }

  public async blockSponsorship(sponosrshipId: number) {
    return await this.sponosrshipService.blockSponsorship(sponosrshipId);
  }

  public async getSponsorship(authority: IUserCookie, sponosrshipId: number) {
    const sponosrship =
      await this.sponosrshipService.getSponsorship(sponosrshipId);

    return sponosrship;
  }
}
