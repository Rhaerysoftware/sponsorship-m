import { Injectable } from '@nestjs/common';
import { IUserCookie } from 'shared/types';
import SponsorshipService from 'src/modules/sponsorModule/sponsor/sponsorShip.service';

@Injectable()
export default class UserSponsorshipManagementRouteService {
  constructor(private sponsorshipService: SponsorshipService) {}

  public async getUserActiveSponsorships(user: IUserCookie) {
    return await this.sponsorshipService.getUserActiveSponsorships(user);
  }

  public async deleteSponsorship(sponsorshipId: number) {
    return await this.sponsorshipService.deleteSponsorship(sponsorshipId);
  }
}
