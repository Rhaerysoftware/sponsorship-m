import { Module } from '@nestjs/common';
import DonationMainModule from 'src/modules/donationModule/donation.main.module';
import SponsorshipMainModule from 'src/modules/sponsorModule/sponsorship.main.module';
import ActorMainModule from 'src/modules/userModule/actors.main.module';

const BusinnessMainModules = [
  ActorMainModule,
  SponsorshipMainModule,
  DonationMainModule,
];

@Module({
  imports: BusinnessMainModules,
  exports: BusinnessMainModules,
})
export default class BusinnessLogicModule {}
