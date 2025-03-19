import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Injector } from 'src/database/utils/repositoryProvider';
import { EmptyData, NotFound } from 'src/utils/error';
import { FixNeedStatus, SponsorshipStatus } from 'src/database/sponsor';
import FixNeed from 'src/database/sponsor/fixNeed/fixNeed.entity';
import ChildDAO from 'src/database/user/child/child.DAO';
import { IGetFixNeedFilter } from 'src/database/sponsor/fixNeed/fixNeed.interface';

@Injectable()
export default class FixNeedDAO {
  constructor(
    @Injector(FixNeed) private fixNeedRepository: Repository<FixNeed>,
    private childDAO: ChildDAO,
  ) {}

  private async saveFixNeedEntity(entity: FixNeed) {
    return await this.fixNeedRepository.save(entity);
  }

  private async updateFixNeedEntity(
    entity: FixNeed,
    updateParams: DeepPartial<FixNeed>,
  ) {
    if (!entity.fixNeedId) throw new Error('There should be fixNeedId');

    return await this.fixNeedRepository.save({
      ...entity,
      ...updateParams,
      fixNeedId: entity.fixNeedId,
    });
  }

  private updateClassInstance(
    entity: FixNeed,
    updatedParams: DeepPartial<FixNeed>,
  ) {
    for (const [key, val] of Object.entries(updatedParams)) {
      entity[key] = val;
    }

    return entity;
  }

  public async getFixNeedWithSponsorship(fixNeedId: number) {
    const fixNeed = await this.fixNeedRepository
      .createQueryBuilder('fix_need')
      .leftJoinAndSelect('fix_need.sponsorship', 'sponsorship')
      .where('fix_need.fixNeedId = :fixNeedId', { fixNeedId })
      .getOne();

    if (!fixNeed) throw new NotFound('Fix Need Does Not Found');

    return fixNeed;
  }

  public async getFreeFixNeedofChild(childId: number) {
    const query = this.fixNeedRepository
      .createQueryBuilder('fix_need')
      // .leftJoin('fix_need.sponsorship', 'sponsorship')
      .where('fix_need.child = :childId', { childId })
      .getMany();

    return query;
  }

  public async getChildFixNeeds(chldId: number, { status }: IGetFixNeedFilter) {
    const child = await this.childDAO.getChild({ userId: chldId });

    let childFixNeeds = this.fixNeedRepository
      .createQueryBuilder('fix_need')
      .leftJoinAndSelect('fix_need.sponsorship', 'sponsorship')
      .leftJoinAndSelect('sponsorship.user', 'user')
      .leftJoinAndSelect('sponsorship.messages', 'message')
      .leftJoinAndSelect('sponsorship.payment', 'payments')
      .leftJoin('fix_need.child', 'child')
      .where('child.userId = :userId AND fix_need.isDeleted = :isDeleted', {
        isDeleted: false,
        userId: child.userId,
      });

    console.log('Status', status);

    let result: FixNeed[];

    if (status === 'ALL') {
    } else if (status === 'Active')
      childFixNeeds = childFixNeeds.andWhere(
        'fix_need.isDeleted = :isDeleted',
        { isDeleted: false },
      );
    else if (status === 'Inactive') {
      childFixNeeds = childFixNeeds.andWhere(
        'fix_need.isDeleted = :isDeleted',
        { isDeleted: true },
      );
    } else {
      childFixNeeds = childFixNeeds.andWhere('sponsorship.status = :status', {
        status: SponsorshipStatus.WAITING_FOR_PAYMENT,
      });
    }

    result = await childFixNeeds.getMany();

    console.log('Result', result);

    // if (result.length === 0)
    //   throw new EmptyData('The Child Fix Needs is Empty');

    child.fixNeeds = result;

    return child;
  }

  public async getDen(childId: number) {
    const child = await this.childDAO.getChild({ userId: childId });

    const fixNeeds = await this.fixNeedRepository
      .createQueryBuilder('fix_need')
      .leftJoinAndSelect('fix_need.sponsorship', 'sponsorship')
      .where(' fix_need.child = :childId AND fix_need.status = :status', {
        status: FixNeedStatus.ACTIVE,
        childId: child.userId,
      })
      .getMany();

    return fixNeeds;
  }

  public async getUserSponsoredFixNeeds(userId: number, childId: number) {
    const fixNeeds = this.fixNeedRepository
      .createQueryBuilder('fix_need')
      .leftJoin('fix_need.sponsorship', 'sponsorship')
      // .addSelect(['sponsorship.status'])
      .where('sponsorship.user = :userId', { userId })
      .andWhere('fix_need.child = :childId', { childId });

    return await fixNeeds.getMany();
  }

  public async getAvailableFixNeeds(childId: number, userId: number) {
    const child = await this.childDAO.getChild({ userId: childId });

    const fixNeeds = this.fixNeedRepository
      .createQueryBuilder('fix_need')
      .leftJoin('fix_need.sponsorship', 'sponsorship')
      .addSelect(['sponsorship.status'])
      .where(
        'sponsorship.fixNeed is NULL AND fix_need.child = :childId AND fix_need.status = :status',
        {
          status: FixNeedStatus.ACTIVE,
          childId: child.userId,
        },
      );

    return [
      ...(await this.getUserSponsoredFixNeeds(userId, childId)),
      ...(await fixNeeds.getMany()),
    ];
  }

  public async getFixNeed(params: FindOptionsWhere<FixNeed>) {
    const fixNeed = await this.fixNeedRepository.findOne({
      where: { ...params },
      relations: { sponsorship: true },
    });

    if (!fixNeed) throw new NotFound('The Child Fix Neeed Not Found');

    return fixNeed;
  }

  public async createFixNeed(
    childId: number,
    fixNeedParams: DeepPartial<FixNeed>,
  ) {
    const child = await this.childDAO.getChild({ userId: childId });

    const fixNeedInstance = this.fixNeedRepository.create({
      ...fixNeedParams,
      child,
    });
    return await this.saveFixNeedEntity(fixNeedInstance);
  }

  public async changeFixNeedStatus(fixNeedId: number, status: FixNeedStatus) {
    const fixNeed = await this.getFixNeed({ fixNeedId });

    fixNeed.status = status;

    fixNeed.isDeleted = true;
    return await this.saveFixNeedEntity(fixNeed);
  }

  public async updateFixNeed(
    fixNeedId: number,
    updateParams: DeepPartial<FixNeed>,
  ) {
    const fixNeed = await this.getFixNeed({ fixNeedId });
    const updatedFixNeed = await this.updateFixNeedEntity(
      fixNeed,
      updateParams,
    );

    return updatedFixNeed;
  }
}
