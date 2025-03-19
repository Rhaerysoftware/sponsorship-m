import { Injectable } from '@nestjs/common';
import { INeedWithTotal } from 'src/database/donation/childNeed/childNeed.DAO.interface';
import { NeedGroupWithNeedsWithTotalDonation } from 'src/database/donation/needGroup/needGroup.DAO.interface';
import { IUserCookie } from 'shared/types';
import {
  CreateNeedDTO,
  EditNeed,
  DonationHistoryParams,
  EditNeedGroupDTO,
  ICreateNeedGroup,
} from 'src/modules/donationModule/childNeed/childNeed.module.interface';
import ChildNeedService from 'src/modules/donationModule/childNeed/childNeed.service';
import Donation from 'src/database/donation/donation/donation.entity';

@Injectable()
export default class NeedManagementRouteService {
  constructor(private childNeedService: ChildNeedService) {}

  public async createNeedGroup(body: ICreateNeedGroup) {
    return await this.childNeedService.createNeedGroup(body);
  }

  public async editNeedGroup(body: EditNeedGroupDTO) {
    return this.childNeedService.editNeedGroup(body);
  }

  public async createNeeds(
    childId: number,
    authority: IUserCookie,
    body: CreateNeedDTO,
  ): Promise<NeedGroupWithNeedsWithTotalDonation> {
    return await this.childNeedService.createNeeds(childId, authority, body);
  }
  public async editNeed(editedNeed: EditNeed) {
    return await this.childNeedService.editNeed2(editedNeed);
  }
  public async deleteNeed(needId: number): Promise<INeedWithTotal> {
    return await this.childNeedService.deleteNeed(needId);
  }
  public async donationHistory(
    userId: number,
    page: number,
    donationHistoryParams: DonationHistoryParams,
  ): Promise<Donation[]> {
    return await this.childNeedService.donationHistory(
      userId,
      page,
      donationHistoryParams,
    );
  }

  public async getChildNeedsData(authority: IUserCookie, childId: number) {
    return await this.childNeedService.getChildNeedsData(authority, childId);
  }
}
