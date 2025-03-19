import { Injectable } from '@nestjs/common';
import { Repository, Or } from 'typeorm';
import { Injector } from 'src/database/utils/repositoryProvider';
import {
  FindSponsorship,
  ISponsorshipHistory,
} from 'src/database/sponsor/sponsorship/sponosrship.interface';
import { NotFound, NotSponsoredError } from 'src/utils/error';
import { SponsorshipStatus } from 'src/database/sponsor';
import { Role } from 'src/database/user';
import UserDAO from 'src/database/user/user/user.DAO';
import BaseUser from 'src/database/user/baseUser';
import ChildDAO from 'src/database/user/child/child.DAO';
import Sponsorship from 'src/database/sponsor/sponsorship/sponsorship.entity';

@Injectable()
export default class SponsorshipDAO {
  checkIfUserSponsorToChild2(userId: number, userId1: number) {
    throw new Error('Method not implemented.');
  }
  public async deleteSponsorship(sponsorshipId: number) {
    const sponsorship = await this.getSponsorship({ sponsorshipId });

    return await this.sponsorshipRepository.delete(sponsorship.sponsorshipId);
  }
  constructor(
    @Injector(Sponsorship)
    private sponsorshipRepository: Repository<Sponsorship>,
    private userDAO: UserDAO,
    private childDAO: ChildDAO,
  ) {}

  private checkEntity(entity: Sponsorship) {
    if (!entity) {
      throw new NotFound('Sponosrship Not Found');
    }
  }

  public async saveSponsorshipEntity(entity: Sponsorship) {
    return await this.sponsorshipRepository.save(entity);
  }

  public async saveSponsorshipEntityArr(entity: Sponsorship[]) {
    return await this.sponsorshipRepository.save(entity);
  }

  public async getChildActiveSponsorships(childId: number) {
    const child = await this.childDAO.getChild({ userId: childId });

    const sponsorships = await this.sponsorshipRepository
      .createQueryBuilder('sponsorship')
      .leftJoinAndSelect('sponsorship.user', 'user')
      .leftJoinAndSelect('sponsorship.fixNeed', 'fix_need')
      .leftJoinAndSelect('fix_need.child', 'child')
      .where('child.userId = :userId', { userId: child.userId })
      .andWhere(
        'sponsorship.status = :approved OR sponsorship.status = :waiting',
        {
          approved: SponsorshipStatus.APPROVED,
          waiting: SponsorshipStatus.WAITING_FOR_PAYMENT,
        },
      )
      .getMany();

    if (sponsorships.length === 0) return null;

    return sponsorships;
  }

  public async getUserChildSponsorship(
    userId: number,
    childId: number,
    sponsorshipId?: number,
  ) {
    const [user, child] = await Promise.all([
      this.userDAO.getUser({ userId }),
      this.childDAO.getChild({ userId: childId }),
    ]);

    const sponsorship = await this.sponsorshipRepository
      .createQueryBuilder('sponsorship')
      .leftJoinAndSelect('sponsorship.fixNeed', 'fix_need')
      .leftJoinAndSelect('fix_need.child', 'child')
      .leftJoinAndSelect('sponsorship.user', 'user')
      .where(
        'user.userId = :userId AND child.userId = :childId AND sponsorship.status = :status',
        {
          childId: child.userId,
          userId: user.userId,
          status: SponsorshipStatus.APPROVED,
        },
      )
      .getOne();

    if (!sponsorship) throw new NotSponsoredError();

    return { child, user, sponsorship };
  }

  public async getUserSponsoredChilds(userId: number) {
    const userPromise = this.userDAO.getUser({ userId });

    const sponsoredChildsPromise =
      this.childDAO.getChildsOfSponosredUser(userId);

    const result = await Promise.all([
      userPromise,
      sponsoredChildsPromise,
    ]).then(([user, sponsoredChilds]) => ({
      user,
      sponsoredChilds,
    }));

    return result;
  }

  public async blockSponsorship(sponsorshipId: number) {
    const sponsorship = await this.getSponsorship({ sponsorshipId });

    sponsorship.status = SponsorshipStatus.BLOCKED;

    return await this.saveSponsorshipEntity(sponsorship);
  }

  public async getSponsorship(sponsorshipParams: FindSponsorship) {
    const sponsorship = await this.sponsorshipRepository.findOne({
      where: { ...sponsorshipParams },
      relations: {
        user: true,
        fixNeed: { child: true },
        payment: true,
        messages: true,
      },
    });

    //this.checkEntity(sponsorship);

    return sponsorship;
  }

  public async isSponsorToNeed(fixNeedId: number) {
    const sponsorship = await this.sponsorshipRepository.findOne({
      where: { fixNeed: { fixNeedId }, status: SponsorshipStatus.APPROVED },
    });

    console.log('Sp', sponsorship);

    return !!sponsorship;
  }

  public async createSponsorship(userId: number, fixNeedId: number) {
    const sponsorShipInstance = this.sponsorshipRepository.create({
      user: { userId },
      fixNeed: { fixNeedId },
    });

    return await this.saveSponsorshipEntity(sponsorShipInstance);
  }

  public async checkIfSponosrshipActive(sponsorshipId: number) {
    const sponosrship = await this.getSponsorship({ sponsorshipId });

    return sponosrship.status !== SponsorshipStatus.APPROVED;
  }

  public async checkIfUserSponsorToChild(userId: number, childId: number) {
    const [user, child] = await Promise.all([
      this.userDAO.getUser({ userId }),
      this.childDAO.getChild({ userId: childId }),
    ]);

    const sponosrship = await this.sponsorshipRepository
      .createQueryBuilder('sponsorship')
      .leftJoinAndSelect('sponsorship.fixNeed', 'fix_need')
      .leftJoinAndSelect('fix_need.child', 'child')
      .leftJoinAndSelect('sponsorship.user', 'user')
      .where(
        'user.userId = :userId AND child.userId = :childId AND sponsorship.status = :status',
        {
          childId: child.userId,
          userId: user.userId,
          status: SponsorshipStatus.APPROVED,
        },
      )
      .getOne();

    if (!sponosrship) return false;

    return !!sponosrship;
  }

  public async getActorMessages(user: BaseUser) {
    const whereAlias =
      user.role === Role.User
        ? `user.userId = :userId`
        : user.role === Role.Child
          ? 'child.userId = :userId'
          : null;

    if (!whereAlias) throw new Error('User Role is Not accepted');

    console.log('WHRE', whereAlias);

    const den = this.sponsorshipRepository
      .createQueryBuilder('sponsorship')
      .innerJoinAndSelect('sponsorship.fixNeed', 'fix_need')
      .innerJoinAndSelect('fix_need.child', 'child')
      .innerJoinAndSelect('sponsorship.user', 'user')
      .leftJoinAndSelect('sponsorship.messages', 'message')
      .orderBy('message.date', 'ASC')
      .where(whereAlias, { userId: user.userId });

    // den.andWhere('sponsorship.status = :status', {
    //   status: SponsorshipStatus.APPROVED,
    // });

    const result = await den.getMany();

    console.log('Messages:', result);

    return result;
  }

  public async getSponsorshipHistory(
    page: number,
    { childId, fixNeedId, range, userId }: ISponsorshipHistory,
  ) {
    const sponsorshipHistoryQuery = this.sponsorshipRepository
      .createQueryBuilder('sponsorship')
      .innerJoinAndSelect('sponsorship.user', 'user')
      .innerJoinAndSelect('sponsorship.fixNeed', 'fix_need')
      .leftJoinAndSelect('fix_need.child', 'child')
      .limit(10)
      .offset(page * 10)
      .orderBy('sponsorship.createdAt');

    if (childId)
      sponsorshipHistoryQuery.andWhere('user.userId = userId', { userId });
    if (childId)
      sponsorshipHistoryQuery.andWhere('child.userId = :childId', { childId });
    if (fixNeedId)
      sponsorshipHistoryQuery.andWhere('fix_need.fixNeedId', { fixNeedId });

    if (range)
      sponsorshipHistoryQuery.andWhere(
        'sponsorship.crteatedAt BETWEEN :start AND :end',
        { start: range[0], end: range[1] },
      );

    const [sponsorshipHistory, count] =
      await sponsorshipHistoryQuery.getManyAndCount();

    return { count, sponsorshipHistory };
  }

  public async getUserActiveSponsorships(userId: number) {
    const query = this.sponsorshipRepository
      .createQueryBuilder('sponsorship')
      .leftJoinAndSelect('sponsorship.user', 'user')
      .leftJoinAndSelect('sponsorship.fixNeed', 'fix_need')
      .leftJoinAndSelect('fix_need.child', 'child')
      .leftJoinAndSelect('sponsorship.payment', 'sponsorship_payment')
      .where('user.userId = :userId', { userId })
      .andWhere(
        'sponsorship.status = :approved OR sponsorship.status = :waiting',
        {
          approved: SponsorshipStatus.APPROVED,
          waiting: SponsorshipStatus.WAITING_FOR_PAYMENT,
        },
      );

    const result = await query.getMany();

    return result;
  }

  public async getChildAllSponsorships(userId: number) {
    return await this.sponsorshipRepository.find({
      where: {
        fixNeed: {
          child: {
            userId,
          },
        },
      },
      relations: {
        fixNeed: {
          child: true,
        },
      },
    });
  }

  public async getChildMessages(userId: number) {
    const query = this.sponsorshipRepository
      .createQueryBuilder('sponsorship')
      .leftJoinAndSelect('sponsorship.fixNeed', 'fix_need')
      .leftJoinAndSelect('fix_need.child', 'child')
      .leftJoinAndSelect('sponsorship.user', 'user')
      .leftJoinAndSelect('sponsorship.messages', 'message')
      .orderBy('message.date', 'ASC')
      .where('child.userId = :userId', { userId });

    return await query.getMany();
  }
}
