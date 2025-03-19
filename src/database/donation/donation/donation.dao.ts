import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Injector } from 'src/database/utils/repositoryProvider';
import { IDonateNeed } from 'src/database/donation/childNeed/childNeed.DAO.interface';
import { DonationHistoryParams } from 'src/modules/donationModule/childNeed/childNeed.module.interface';
import { IPaymentHistoryFilters } from 'src/database/donation/donation/donation.types';
import Donation from 'src/database/donation/donation/donation.entity';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';
import UserDAO from 'src/database/user/user/user.DAO';
import ChildNeedDAO from 'src/database/donation/childNeed/childNeed.DAO';

@Injectable()
export default class DonationDAO {
  constructor(
    @Injector(Donation) private donationRepository: Repository<Donation>,
    @Inject(forwardRef(() => ChildNeedDAO)) private childNeedDAO: ChildNeedDAO,
    private userDAO: UserDAO,
  ) {}

  private async saveDonationEntity(entity: Donation) {
    return await this.donationRepository.save(entity);
  }

  public async getTotalDonationOfNeed(needId: number) {
    const { totalDonation } = await this.donationRepository
      .createQueryBuilder('donation')
      .select('SUM(IFNULL(donation.amount,0)) AS totalDonation')
      .where('donation.childNeed = :needId', { needId })
      .getRawOne();

    /*  console.log(
      'saddasdadadasdsadsadasdasddsadsa,',
      await this.donationRepository
        .createQueryBuilder('donation')
        .where('donation.childNeed = 1')
        .getOne(),
    );
*/

    if (!totalDonation) return 0;

    return totalDonation as number;
  }

  public async createDonation(donationParams: DeepPartial<Donation>) {
    const donationInstance = this.donationRepository.create({
      ...donationParams,
    });

    return await this.saveDonationEntity(donationInstance);
  }

  public async donateToNeed(userId: number, { amount, needId }: IDonateNeed) {
    const [user, childNeed] = await Promise.all([
      this.userDAO.getUser({ userId }),
      this.childNeedDAO.getNeed({ needId }) as Promise<ChildNeed>,
    ]);

    const childNeedPrice = childNeed.amount * childNeed.price;
    const left = childNeedPrice - childNeed.totals;

    if (amount > left) throw new Error('Dayı olmaz');

    const donation = await this.createDonation({ amount, childNeed, user });

    return donation;
  }

  public async getPaymentHistory(
    { childId, range, userId }: IPaymentHistoryFilters,
    page: number = 0,
  ) {
    const paymentHistoryQuery = this.donationRepository
      .createQueryBuilder('donation')
      .leftJoinAndSelect('donation.childNeed', 'child_need')
      .leftJoinAndSelect('child_need.group', 'need_group')
      .leftJoinAndSelect('need_group.child', 'child')
      .leftJoinAndSelect('donation.user', 'user')
      .orderBy('donation.createdAt', 'ASC')
      .limit(10)
      .offset(page * 10);

    if (childId)
      paymentHistoryQuery.andWhere('child.userId = :childId', { childId });

    if (userId)
      paymentHistoryQuery.andWhere('user.userId = :userId', { userId });

    if (range)
      paymentHistoryQuery.andWhere(
        'donation.createdAt >= :lowerRange AND donation.createdAt <= :higherRange',
        { lowerRange: range[0], higherRange: range[1] },
      );

    const [paymentHistory, count] = await paymentHistoryQuery.getManyAndCount();

    return { paymentHistory, count };
  }

  /* Patlayabilir*/
  public async getDonationHistory(
    userId: number,
    { dateRange }: DonationHistoryParams,
    page: number,
  ) {
    if (page < 0) throw new Error('Baba aman dikkat');

    const userParam = { userId };

    const user = await this.userDAO.getUser(userParam);

    let donationHistory = this.donationRepository
      .createQueryBuilder('donation')
      .leftJoin('donation.user', 'user')
      .leftJoin('child_need.group', 'need_group')
      .leftJoinAndSelect('donation.childNeed', 'child_need')
      .leftJoinAndSelect('need_group.child', 'child')
      .where('user.userId = :userId', { userId: user.userId });

    if (dateRange) {
      donationHistory = donationHistory.andWhere(
        'donation.createdAt BETWEEN :start and :end',
        { start: dateRange[0], end: dateRange[1] },
      );
    }

    return await donationHistory.getMany();
  }

  public async getNeedDonations(needId: number) {
    const res = await this.donationRepository.find({
      where: { childNeed: { needId } },
      relations: {
        user: true,
      },
    });

    return res;
  }
}
