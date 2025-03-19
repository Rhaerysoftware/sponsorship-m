import { Module, forwardRef } from '@nestjs/common';
import DatabaseModule from 'src/database/main/database.module';
import DonationService from 'src/modules/donationModule/donation/donation.service';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [DonationService],
  exports: [DonationService],
})
export default class DonationModule {}
