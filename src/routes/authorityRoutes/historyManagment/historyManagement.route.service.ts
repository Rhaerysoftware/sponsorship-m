import { Injectable } from '@nestjs/common';
import DonationService from 'src/modules/donationModule/donation/donation.service';
import SponsorshipService from 'src/modules/sponsorModule/sponsor/sponsorShip.service';
import {
  HistoryDTO,
  SponsorshipHistoryDTO,
} from 'src/routes/authorityRoutes/historyManagment/historyManagement.route.interface';
import { IUserCookie } from 'shared/types';

@Injectable()
export default class HistoryManagementRouteService {
  constructor(
    private donationService: DonationService,
    private sponsorshipService: SponsorshipService,
  ) {}

  public async getSponsorshipHistory(
    authority: IUserCookie,
    requestBody: SponsorshipHistoryDTO,
    page: number,
  ) {
    return await this.sponsorshipService.getSponsorshipistory(
      authority,
      requestBody,
      page,
    );
  }

  public async listHistory(
    authority: IUserCookie,
    requestBody: HistoryDTO,
    page: number,
  ) {
    if (requestBody.type === 'Donation') {
      return await this.donationService.listPaumentHistory(requestBody, page);
    }

    return 2;
  }
}
