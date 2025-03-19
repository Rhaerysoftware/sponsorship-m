import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import { EmptyData, NotFound } from 'src/utils/error';
import { Repository, DeepPartial, FindOptionsWhere, In } from 'typeorm';
import { INeedWithTotal } from 'src/database/donation/childNeed/childNeed.DAO.interface';
import UserDAO from 'src/database/user/user/user.DAO';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';
import DonationDAO from 'src/database/donation/donation/donation.DAO';
import { NeedStatus } from 'src/database/donation';

@Injectable()
export default class ChildNeedDAO {
  constructor(
    @Injector(ChildNeed) private childNeedRepository: Repository<ChildNeed>,
    @Inject(forwardRef(() => DonationDAO)) private donationDAO: DonationDAO,
    private userDAO: UserDAO,
  ) {}

  private updateInstance(
    needEntity: ChildNeed,
    updateParams: DeepPartial<ChildNeed>,
  ) {
    for (const [key, val] of Object.entries(updateParams)) {
      needEntity[key] = val;
    }

    return needEntity;
  }

  private async saveChildNeed(childNeedEntity: ChildNeed) {
    return this.childNeedRepository.save(childNeedEntity);
  }

  public async createNeed(childNeed: DeepPartial<ChildNeed>) {
    const childNeeds = this.childNeedRepository.create(childNeed);

    return await this.saveChildNeed(childNeeds);
  }

  public async getNeed2(attributes: FindOptionsWhere<ChildNeed>) {
    const need = await this.childNeedRepository.findOne({
      where: { ...attributes },
    });

    if (!need) throw new NotFound();

    const totalDonation = await this.donationDAO.getTotalDonationOfNeed(
      need.needId,
    );

    need.totals = totalDonation;

    return need;
  }

  public async getNeed(
    attributes: FindOptionsWhere<ChildNeed> | FindOptionsWhere<ChildNeed>[],
  ) {
    if (Array.isArray(attributes)) {
      const needs = await this.childNeedRepository.find({
        where: { ...attributes },
      });

      if (needs.some((need) => !!need === false)) throw new NotFound();
      return needs;
    }

    const need = await this.childNeedRepository.findOne({
      where: { ...attributes },
    });

    if (!need) throw new NotFound();

    return need;
  }

  public async getNeedWithTotalDonation(
    needId: number,
    isDeleted: boolean = false,
  ) {
    const query = this.childNeedRepository
      .createQueryBuilder('child_need')
      .leftJoinAndSelect('child_need.donations', 'donation')
      .select([
        'child_need.*',
        'SUM(IFNULL(donation.amount,0)) as totalDonation',
      ])
      .where(
        'child_need.needId = :needId AND child_need.isDeleted = :isDeleted',
        {
          needId,
          isDeleted,
        },
      );
    const needWithTotal = (await query.getRawOne()) as INeedWithTotal;

    const x = await this.donationDAO.getNeedDonations(needWithTotal.needId);
    console.log('xxxxx', x, needWithTotal);

    if (needWithTotal.needId !== null) {
      needWithTotal.donations = x;
    }

    if (!needWithTotal) throw new NotFound();

    return needWithTotal;
  }

  public async updateNeed({ needId, ...rest }: DeepPartial<ChildNeed>) {
    if (!needId) throw new NotFound();

    const need = (await this.getNeed({ needId })) as ChildNeed;

    const updatedNeed = await this.saveChildNeed(
      this.updateInstance(need, rest),
    );

    return await this.getNeedWithTotalDonation(updatedNeed.needId);
  }

  public async getNeedsWithIds(ids: number[]) {
    console.log('IDS', ids);
    const needs = await Promise.all(
      ids.map((needId) => this.getNeedWithTotalDonation(needId)),
    );
    return needs;
  }

  public async deleteNeed(needId: number) {
    const need = await this.getNeed2({ needId });
    need.isDeleted = true;

    const deletedNeed = await this.saveChildNeed(need);

    return deletedNeed;
  }

  /*New SAKIN SİLME AMK*/

  public async updateArrayChildNeedEntity(entity: ChildNeed[]) {
    return await this.childNeedRepository.save(entity);
  }

  public async updateChildNeedEntity(
    needId: number,
    updateParams: Omit<ChildNeed, 'needId'>,
  ) {}

  public async getNeedGroupNeedsWithTotalDonation(needGroupId: number) {
    const needs = await this.childNeedRepository
      .createQueryBuilder('child_need')
      .where('child_need.group = :needGroupId', { needGroupId })
      .getMany();

    if (needs.length < 1) throw new EmptyData();

    const totalDonationsOfNeeds = await Promise.all(
      needs.map((need) => this.donationDAO.getTotalDonationOfNeed(need.needId)),
    );

    return totalDonationsOfNeeds.map((totalDonation, i) => {
      needs[i].totals = totalDonation;
      return needs[i];
    });
  }
}

/*
  public async listNeedsWithChild(
    userId: number,
    { age, city, urgency }: ListChildWithNeeds,
  ) {
    await this.userDAO.getUser({ userId });

    let needListWİthChild = this.needGroupRepository
      .createQueryBuilder('need_group')
      .leftJoinAndSelect('need_group.child', 'child')
      .leftJoinAndSelect('need_group.needs', 'child_need');

    if (age) {
      needListWİthChild = needListWİthChild.andWhere(
        'child.age  :min and :max',
        {
          min: age[0],
          max: age[1],
        },
      );
    }

    if (city) {
      needListWİthChild = needListWİthChild.andWhere('child.city = :city', {
        city,
      });
    }

    if (urgency) {
      needListWİthChild = needListWİthChild.andWhere(
        'child_need.urgency = :urgency',
        { urgency },
      );
    }

    // sort edilmesi gerek

    const count = await needListWİthChild.getCount();

    return await needListWİthChild.getMany();
  }
*/
