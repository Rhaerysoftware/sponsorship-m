import { Module, forwardRef } from '@nestjs/common';
import DatabaseModule from 'src/database/main/database.module';
import SponsorshipPaymentService from 'src/modules/sponsorModule/sponsorshipPayment/sponsorshipPayment.service';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [SponsorshipPaymentService],
})
export default class SponsorshipPaymentModule {}
