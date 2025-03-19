import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { FixNeedStatus, SponsorshipStatus } from 'src/database/sponsor';
import FixNeedDAO from 'src/database/sponsor/fixNeed/fixNeed.DAO';
import FixNeed from 'src/database/sponsor/fixNeed/fixNeed.entity';
import {
  CreateFixNeedDTO,
  GetFixNeedsDTO,
} from 'src/routes/authorityRoutes/fixNeedManagement/fixNeedManagamenet.interface';
import ChildDAO from 'src/database/user/child/child.DAO';
import SponsorshipDAO from 'src/database/sponsor/sponsorship/sponsorship.dao';

@Injectable()
export default class FixNeedService {
  constructor(
    private fixNeedDAO: FixNeedDAO,
    private childDAO: ChildDAO,
    private sponsorshipDAO: SponsorshipDAO,
  ) {}

  public async gtFixNeedsOfChild(childId: number, body: GetFixNeedsDTO) {
    return await this.fixNeedDAO.getChildFixNeeds(childId, body);
  }

  public async getFixNeedsOfChild(childId: number) {
    const child = await this.childDAO.getChild({ userId: childId });
    const fixNeeds = await this.fixNeedDAO.getFreeFixNeedofChild(child.userId);
    const sponsorships = await this.sponsorshipDAO.getChildAllSponsorships(
      child.userId,
    );

    const notSponsoredFixNeeds: FixNeed[] = fixNeeds.filter(({ fixNeedId }) => {
      const isThereSponsor = sponsorships.find(
        (sp) => sp.fixNeed.fixNeedId === fixNeedId,
      );

      if (isThereSponsor) return false;
      else return true;
    });
    console.log('Spsss', sponsorships);

    return notSponsoredFixNeeds;
  }

  public async createFixNeed(body: CreateFixNeedDTO, childId: number) {
    const newFixNeed = await this.fixNeedDAO.createFixNeed(childId, {
      ...body,
    });

    const fixNeed = await this.fixNeedDAO.getFixNeedWithSponsorship(
      newFixNeed.fixNeedId,
    );

    return fixNeed;
  }

  public async disableFixNeed(fixNeedId: number) {
    const disabledFixNeed = await this.fixNeedDAO.changeFixNeedStatus(
      fixNeedId,
      FixNeedStatus.DEACTIVE,
    );

    const sponsorshipOfFixNeed = await this.sponsorshipDAO.getSponsorship({
      fixNeed: { fixNeedId },
    });

    console.log('Sp', sponsorshipOfFixNeed);

    if (sponsorshipOfFixNeed !== null) {
      sponsorshipOfFixNeed.status = SponsorshipStatus.DENIED;
      await this.sponsorshipDAO.saveSponsorshipEntity(sponsorshipOfFixNeed);
    }

    return disabledFixNeed;
  }

  public async updateFixNeed(
    fixNeedId: number,
    updateParams: DeepPartial<FixNeed>,
  ) {
    const updatedFixNeed = await this.fixNeedDAO.updateFixNeed(
      fixNeedId,
      updateParams,
    );

    console.log('Updated Fix Need', updatedFixNeed);

    const fixNeedWithSponsorship =
      await this.fixNeedDAO.getFixNeedWithSponsorship(updatedFixNeed.fixNeedId);

    return fixNeedWithSponsorship;
  }
}
