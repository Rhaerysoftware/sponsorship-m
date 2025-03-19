import { Injectable } from '@nestjs/common';
import { AlreadyHave } from 'src/utils/error';
import FixNeedDAO from 'src/database/sponsor/fixNeed/fixNeed.DAO';
import SponsorshipDAO from 'src/database/sponsor/sponsorship/sponsorship.dao';
import UserDAO from 'src/database/user/user/user.DAO';
import SponsorshipPaymnetDAO from 'src/database/sponsor/sponsorshipPayment/sponsorsipPaymnet.DAO';
import { IUserCookie } from 'shared/types';
import { SponsorshipHistoryDTO } from 'src/routes/authorityRoutes/historyManagment/historyManagement.route.interface';

@Injectable()
export default class SponsorshipService {
  public async isUserSponsoredToChild(userId: number, userId1: number) {
    return await this.sponsorshipDAO.checkIfUserSponsorToChild(userId, userId1);
  }
  constructor(
    private sponsorshipDAO: SponsorshipDAO,
    private fixNeedDAO: FixNeedDAO,
    private userDAO: UserDAO,
    private sponsorshipPaymentDAO: SponsorshipPaymnetDAO,
  ) {}

  public async getSponsorshipMessages(sponsorshipId: number) {
    return await this.sponsorshipDAO.getSponsorship({ sponsorshipId });
  }

  public async blockSponsorship(sponosrshipId: number) {
    return await this.sponsorshipDAO.blockSponsorship(sponosrshipId);
  }

  public async getSponsorship(sponsorshipId: number) {
    const sponsorship = await this.sponsorshipDAO.getSponsorship({
      sponsorshipId,
    });

    return sponsorship;
  }

  public async getSponsorableFixNeeds(childId: number, userId: number) {
    const availableFixNeeds = await this.fixNeedDAO.getAvailableFixNeeds(
      childId,
      userId,
    );

    return availableFixNeeds;
  }

  public async sponsorToChild(userId: number, fixNeedId: number) {
    const fixNeed = await this.fixNeedDAO.getFixNeed({ fixNeedId });

    const isFixNeedSponsored =
      await this.sponsorshipDAO.isSponsorToNeed(fixNeedId);

    console.log('isFixNeedSponsored', isFixNeedSponsored);

    if (isFixNeedSponsored)
      throw new AlreadyHave('This Fix Need Already Sponsored');

    const sponsorship = await this.sponsorshipDAO.createSponsorship(
      userId,
      fixNeedId,
    );

    const payment = await this.sponsorshipPaymentDAO.createPaymentRecord(
      sponsorship.sponsorshipId,
      fixNeed.amount,
    );

    return sponsorship;
  }

  public async getUserSponsoredChilds(userId: number) {
    return await this.sponsorshipDAO.getUserSponsoredChilds(userId);
  }

  public async getSponsorshipistory(
    authority: IUserCookie,
    body: SponsorshipHistoryDTO,
    page: number,
  ) {
    const result = await this.sponsorshipDAO.getSponsorshipHistory(page, body);
    return result;
  }

  public async getUserActiveSponsorships({ userId }: IUserCookie) {
    const user = await this.userDAO.getUser({ userId });
    return await this.sponsorshipDAO.getUserActiveSponsorships(user.userId);
  }

  public async deleteSponsorship(sponsorshipId: number) {
    return await this.sponsorshipDAO.deleteSponsorship(sponsorshipId);
  }
}
