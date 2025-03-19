import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Injector } from 'src/database/utils/repositoryProvider';
import { IPaginationData } from 'shared/types';
import { ChildNeedGroupStatus } from 'src/database/donation';
import {
  HasActiveNeedGroupError,
  HasNoActiveNeedGroupError,
  NotFound,
  ServerError,
} from 'src/utils/error';
import {
  DeepPartialNeedGroup,
  IFilterNeedGroup,
  NeedGroupWithNeedsWithTotalDonation,
} from 'src/database/donation/needGroup/needGroup.DAO.interface';
import ChildDAO from 'src/database/user/child/child.DAO';
import ChildNeedDAO from 'src/database/donation/childNeed/childNeed.DAO';
import NeedGroup from 'src/database/donation/needGroup/needGroup.entity';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export default class NeedGroupDAO {
  constructor(
    @Injector(NeedGroup)
    private needGroupRepository: Repository<NeedGroup>,
    private childDAO: ChildDAO,
    private childNeedDAO: ChildNeedDAO,
  ) {}

  public async saveNeedGroupEntity(entity: NeedGroup) {
    return await this.needGroupRepository.save(entity);
  }

  public async checkIfNeedsBelongsToNeedGroup(
    needGroupId: number,
    needIds: number[],
  ) {
    const needGroupWithNeeds = await this.needGroupRepository.findOne({
      where: { needGroupId },
      relations: { needs: true },
    });
    const needs = await this.childNeedDAO.getNeedsWithIds(needIds);

    if (!needGroupWithNeeds) throw new ServerError();

    const groupNeedsIds = needGroupWithNeeds.needs.map(({ needId }) => needId);
    const childNeedIds = needs.map(({ needId }) => needId);

    return childNeedIds.every((needId) => groupNeedsIds.includes(needId));
  }

  public async getActiveGroupOfChild(childId: number) {
    const activeGroups = await this.needGroupRepository.find({
      where: { status: ChildNeedGroupStatus.OPEN, child: { userId: childId } },
    });

    if (activeGroups.length > 1) throw new HasActiveNeedGroupError();

    if (activeGroups.length === 0) return null;

    return activeGroups[0];
  }

  public async getActiveNeedGroupWithNeeds(childId: number) {
    const activeNeedGroup = (await this.getActiveNeedGroups(
      childId,
    )) as NeedGroupWithNeedsWithTotalDonation;

    if (!activeNeedGroup) throw new HasNoActiveNeedGroupError();

    const promiseChildNeeds = activeNeedGroup.needs.map(({ needId }) =>
      this.childNeedDAO.getNeedWithTotalDonation(needId),
    );

    const childNeeds = await Promise.all([...promiseChildNeeds]).then(
      (res) => res,
    );

    activeNeedGroup.needs = childNeeds;

    return activeNeedGroup;
  }

  public async getActiveNeedGroups(userId: number) {
    const child = await this.childDAO.getChild({ userId });

    const activeGroups = await this.needGroupRepository
      .createQueryBuilder('need_group')
      .leftJoinAndSelect('need_group.needs', 'child_need')
      .leftJoin('need_group.child', 'child')
      .where('child.userId = :userId', { userId })
      .andWhere('need_group.status = :status', {
        status: ChildNeedGroupStatus.OPEN,
      })
      .getMany();

    console.log('Active Group:', activeGroups);

    if (activeGroups.length === 0) return null;

    if (activeGroups.length > 1 || !activeGroups.every((group) => !!group))
      throw new ServerError('Active needs should not be more than one.');

    activeGroups[0].child = child;

    return activeGroups[0];
  }

  public async createChildNeedGroup(
    userId: number,
    needGroupParams?: DeepPartialNeedGroup,
  ) {
    const child = await this.childDAO.getChild({ userId });

    const activeNeeds = await this.getActiveNeedGroups(child.userId);

    if (activeNeeds) throw new HasActiveNeedGroupError();

    const needGroupInstance = this.needGroupRepository.create({
      ...needGroupParams,
      child: { userId },
    });

    return await this.saveNeedGroupEntity(needGroupInstance);
  }

  public async checkIfNeedGroupIsActive(needGroupId: number) {
    const needGroup = await this.needGroupRepository.findOne({
      where: { needGroupId },
    });

    if (!needGroup) throw new NotFound();

    return needGroup.status === ChildNeedGroupStatus.OPEN;
  }

  public async listSponsorableNeeds(
    { city, urgency }: IFilterNeedGroup = {},
    page: number = 0,
  ): Promise<IPaginationData<NeedGroup>> {
    const query = this.needGroupRepository
      .createQueryBuilder('need_group')
      .innerJoinAndSelect('need_group.child', 'child')
      .innerJoinAndSelect('need_group.needs', 'child_need')
      .leftJoinAndSelect('child_need.donations', 'donations')
      .skip(page * 10)
      .take(10)
      .where('child_need.isDeleted = false')
      .andWhere('need_group.status = :status', {
        status: ChildNeedGroupStatus.OPEN,
      });

    if (city) query.andWhere('child.city = :city', { city });
    if (urgency) query.andWhere('child_need.urgency = :urgency', { urgency });

    const [result, count] = await query.getManyAndCount();

    result.forEach((needGroup) => {
      needGroup.needs.forEach((need) => {
        const totalDonation = need.donations.reduce(
          (acc, val) => acc + val.amount,
          0,
        );
        need.totals = totalDonation;
      });
    });

    return { result, count };
  }

  /*newwwwwwwwwww (SAKIN SİLME AMINA KOYARIM SENİN) */

  public async updateNeedGroupEntity(
    needGroupId: number,
    updateParams: Omit<NeedGroup, 'needGroupId'>,
  ) {
    return (await this.needGroupRepository.save({
      ...updateParams,
      needGroupId,
    })) as NeedGroup;
  }
  public async updateNeedGroupEntity2(
    needGroupId: number,
    updateParams: DeepPartialNeedGroup,
  ) {
    const daved = (await this.needGroupRepository.save({
      ...updateParams,
      needGroupId,
    })) as NeedGroup;

    return await this.needGroupRepository.findOne({
      where: { needGroupId },
      relations: { child: true, needs: true },
    });
  }

  public async getActiveNeedGroupOfChild(childId: number) {
    const child = await this.childDAO.getChild({ userId: childId });
    const activeNeedGroup = await this.getActiveNeedGroups(child.userId);

    return activeNeedGroup;
  }

  public async newGetActiveNeedGroupWithChildNeedWithTotalDonation(
    childId: number,
  ) {
    const activeNeedGroup = await this.getActiveGroupOfChild(childId);

    if (!activeNeedGroup) return null;

    const activeNeedGroupNeeds =
      await this.childNeedDAO.getNeedGroupNeedsWithTotalDonation(
        activeNeedGroup.needGroupId,
      );
    activeNeedGroup.needs = activeNeedGroupNeeds;

    return activeNeedGroup;
  }
}
