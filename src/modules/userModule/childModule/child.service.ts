import { Injectable } from '@nestjs/common';
import type {
  ICreateChild,
  IFilterChilds,
  ISortChilds,
} from 'src/modules/userModule/childModule/child.module.interface';
import type { IUserCookie } from 'shared/types';
import type { ChildWhere } from 'src/database/user/child/child.DAO.interface';
import { EditChildDTO } from 'src/routes/authorityRoutes/childManagement/childManagement.interface';
import ChildDAO from 'src/database/user/child/child.DAO';
import ChildStatusDAO from 'src/database/user/childStatus/childStatus.DAO';
import SafeDAO from 'src/database/donation/safe/safe.DAO';
import NeedGroupDAO from 'src/database/donation/needGroup/needGroup.DAO';
import SponsorshipDAO from 'src/database/sponsor/sponsorship/sponsorship.dao';
import { SponsorshipStatus } from 'src/database/sponsor';
import { ChildNeedGroupStatus, NeedStatus } from 'src/database/donation';
import ChildNeedDAO from 'src/database/donation/childNeed/childNeed.DAO';
import { cryptor } from 'src/utils/util';

@Injectable()
export default class ChildService {
  constructor(
    private safeDAO: SafeDAO,
    private childDAO: ChildDAO,
    private childStatusDAO: ChildStatusDAO,
    private needGroupDAO: NeedGroupDAO,
    private sponsorshipDAO: SponsorshipDAO,
    private childNeedDAO: ChildNeedDAO,
  ) {}

  public async createChild(authority: IUserCookie, createParams: ICreateChild) {
    const city = authority.city;

    const childStatus = await this.childStatusDAO.createChildStatus({
      text: 'Child is 7th grade',
    });

    const childSafe = await this.safeDAO.createChildSafe({ totalMoney: 0 });

    const password = cryptor(createParams.password, 'encrypt');

    const child = await this.childDAO.createChild({
      safe: childSafe,
      status: [childStatus],
      city,
      ...createParams,
      password,
    });

    return child;
  }

  public async getChild(childSearchParams: ChildWhere) {
    const child = await this.childDAO.getChild(childSearchParams);
    /*
    const childSafe = await this.safeDAO.getChildSafe({ child });

    child.safe = childSafe;
*/
    return child;
  }

  public async getChildCard(childId: number) {
    return await this.childDAO.getChildCard(childId);
  }

  public async deleteChild(childId: number, authority: IUserCookie) {
    const deletedChild = await this.childDAO.deleteChild(childId);

    const activeNeedGroupWithNeeds =
      await this.needGroupDAO.getActiveNeedGroupWithNeeds(deletedChild.userId);

    const childSponsorships =
      await this.sponsorshipDAO.getChildActiveSponsorships(childId);

    const disabledSponsorships =
      await this.sponsorshipDAO.saveSponsorshipEntityArr(
        childSponsorships.map((sp) => {
          sp.status = SponsorshipStatus.CHILD_DELETED;
          return sp;
        }),
      );

    return deletedChild;
  }

  public async editChild(childId: number, body: EditChildDTO) {
    const editedChild = await this.childDAO.updateChild(childId, body);

    return editedChild;
  }

  public async listChilds(
    authority: IUserCookie,
    filters: IFilterChilds,
    sort: ISortChilds,
    page: number,
  ) {
    const listedChilds = await this.childDAO.listChilds(filters, sort, page);

    return listedChilds;
  }

  /*New*/

  public async cancelChildNeeds(childId: number) {
    const activeNeedsOfChild =
      await this.needGroupDAO.newGetActiveNeedGroupWithChildNeedWithTotalDonation(
        childId,
      );

    if (!activeNeedsOfChild) return null;

    activeNeedsOfChild.status = ChildNeedGroupStatus.CLOSE;

    const updatedNeeds = await this.childNeedDAO.updateArrayChildNeedEntity(
      activeNeedsOfChild.needs.map((need) => {
        const status = need.status;
        if (status === NeedStatus.COMPLETED || status === NeedStatus.MET)
          return need;
        need.status = NeedStatus.NOT_COMPLETED;
        return need;
      }),
    );

    await this.needGroupDAO.updateNeedGroupEntity(
      activeNeedsOfChild.needGroupId,
      activeNeedsOfChild,
    );
    /*
    const needGroupTotal = activeNeedsOfChild.needs.reduce(
      (acc, val) => acc + val.totals,
      0,
    );

    const updatedChildSafe = await this.safeDAO.addMoneyToChildSafe(
      childId,
      needGroupTotal,
    );

    return { safe: updatedChildSafe, needGroup: activeNeedsOfChild };*/
  }

  public async cancelChildSponsorships(childId: number) {
    // çocuğun sponsorluklarını al
    // sponosrlukların durumunu CHILD_DELETED olarak işaretle
    // kayedet
    const childActiveSponosrships =
      await this.sponsorshipDAO.getChildActiveSponsorships(childId);

    if (!childActiveSponosrships) return null;

    const updatedSponosrships =
      await this.sponsorshipDAO.saveSponsorshipEntityArr(
        childActiveSponosrships.map((sponsorship) => {
          sponsorship.status = SponsorshipStatus.CHILD_DELETED;
          return sponsorship;
        }),
      );

    return updatedSponosrships;
  }

  public async deleteChild2(childId: number, authority: IUserCookie) {
    const child = await this.childDAO.getChild({ userId: childId });
    const cancelChildNeedsResult = await this.cancelChildNeeds(childId);
    const cancelChildSponosrships = await this.cancelChildSponsorships(childId);
    child.isDeleted = true;
    const updatedChild = await this.childDAO.saveChildEntity(child);

    return updatedChild;
    //return { child, cancelChildNeedsResult, cancelChildSponosrships };
  }
}
