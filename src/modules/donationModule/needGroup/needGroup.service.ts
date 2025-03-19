import { Injectable } from '@nestjs/common';
import { IFilterNeedGroup } from 'src/database/donation/needGroup/needGroup.DAO.interface';
import {
  DonateToNeedsDTO,
  IDonateChildNeedDTO,
} from 'src/routes/userRoutes/childInNeed/childInNeed.interface';
import { IUserCookie } from 'shared/types';
import { BadRequestError, ServerError } from 'src/utils/error';
import NeedGroupDAO from 'src/database/donation/needGroup/needGroup.DAO';
import ChildNeedDAO from 'src/database/donation/childNeed/childNeed.DAO';
import Donation from 'src/database/donation/donation/donation.entity';
import DonationDAO from 'src/database/donation/donation/donation.DAO';
import UserDAO from 'src/database/user/user/user.DAO';

@Injectable()
export default class NeedGroupService {
  constructor(
    private needGroupDAO: NeedGroupDAO,
    private childNeedDAO: ChildNeedDAO,
    private donationDAO: DonationDAO,
    private userDAO: UserDAO,
  ) {}

  public async listChildwtihNeeds(filters: IFilterNeedGroup, page: number) {
    const result = await this.needGroupDAO.listSponsorableNeeds(filters, page);

    return result;
  }
  /*
  public async donateToNeeds(user: IUserCookie, requestBody: DonateToNeedsDTO) {
    try {
      const isCorrectIds =
        await this.needGroupDAO.checkIfNeedsBelongsToNeedGroup(
          requestBody.needGroupId,
          Object.keys(requestBody.donatedNeeds).map(([key]) => parseInt(key)),
        );

      const childNeeds = await this.childNeedDAO.getNeedsWithIds(
        Object.keys(requestBody.donatedNeeds).map(([key]) => parseInt(key)),
      );

      const donationRequests: Promise<Donation>[] = [];

      for (const childNeed of childNeeds) {
        const donatedNeed = requestBody.donatedNeeds[childNeed.needId];
        if (!donatedNeed) throw new ServerError();

        const isMuch =
          childNeed.amount * childNeed.price - childNeed.totals <
          donatedNeed.amount;

        if (childNeed.price * childNeed.amount < donatedNeed.amount || isMuch)
          throw new BadRequestError();

        donationRequests.push(
          this.donationDAO.donateToNeed(user.userId, donatedNeed),
        );
      }

      const donations = await Promise.all(donationRequests).then((res) => res);

      return donations;
    } catch (error) {
      console.log('Error', error);
    }
  }*/

  public async donateToNeeds2(
    { userId }: IUserCookie,
    requestBody: DonateToNeedsDTO,
  ) {
    const user = await this.userDAO.getUser({ userId });
    const donatedNeedsIDs = requestBody.donatedNeeds.map(
      ({ needId }) => needId,
    );
    console.log('Donate Need Ids', donatedNeedsIDs);
    const needs = await this.childNeedDAO.getNeedsWithIds(donatedNeedsIDs);

    const promiser: Promise<Donation>[] = [];

    for (const need of needs) {
      const donated = requestBody.donatedNeeds.find(
        ({ needId }) => needId === need.needId,
      );
      const needPrice = need.amount * need.price;

      if (!donated) throw new Error('Bunada bak');

      const needCompleted = needPrice < need.totalDonation;
      const isExceeding = need.totalDonation + donated.amount > needPrice;

      console.log(
        'Need Copleted',
        needCompleted,
        'Is Exceeding',
        isExceeding,
        need,
      );

      if (needCompleted || isExceeding) throw new Error('Bir bakıver');

      promiser.push(this.donationDAO.donateToNeed(userId, donated));
    }

    const donations = await Promise.all(promiser);

    return donations;
  }
}
