import { Injectable } from '@nestjs/common';
import SponsorshipPaymentDAO from 'src/database/sponsor/sponsorshipPayment/sponsorsipPaymnet.DAO';

@Injectable()
export default class SponsorshipPaymentService {
  constructor(private sponsorshipPaymentDAO: SponsorshipPaymentDAO) {}
}
