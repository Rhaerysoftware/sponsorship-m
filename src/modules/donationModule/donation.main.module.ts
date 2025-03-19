import { Module } from '@nestjs/common';
import SafeModule from 'src/modules/donationModule/safe/safe.module';
import ChildNeedModule from 'src/modules/donationModule/childNeed/childNeed.module';
import NeedGroupModule from 'src/modules/donationModule/needGroup/needGroup.module';
import DonationModule from 'src/modules/donationModule/donation/donation.module';

const DonationModules = [
  ChildNeedModule,
  SafeModule,
  NeedGroupModule,
  DonationModule,
];

@Module({
  imports: DonationModules,
  exports: DonationModules,
})
export default class DonationMainModule {}
