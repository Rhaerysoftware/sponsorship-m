import { Injectable } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import { Repository } from 'typeorm';
import SponsorshipPayment from 'src/database/sponsor/sponsorshipPayment/sponsorshipPayment.entity';

@Injectable()
export default class SponsorshipPaymentDAO {
  @Injector(SponsorshipPayment)
  private sponsorshipPaymentRepository: Repository<SponsorshipPayment>;

  private async saveSponsorshipPaymentEntity(entity: SponsorshipPayment) {
    return await this.sponsorshipPaymentRepository.save(entity);
  }

  public async createPaymentRecord(
    sponsorshipId: number,
    paymentAmount: number,
  ) {
    const payment = this.sponsorshipPaymentRepository.create({
      sponsorship: { sponsorshipId },
      paymentAmount,
    });

    return await this.saveSponsorshipPaymentEntity(payment);
  }
}
