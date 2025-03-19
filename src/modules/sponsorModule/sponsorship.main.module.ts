import { Module } from '@nestjs/common';
import FixNeedModule from 'src/modules/sponsorModule/fixNeed/fixNeed.module';
import MessageModule from 'src/modules/sponsorModule/messageModule/message.module';
import SponsorShipModule from 'src/modules/sponsorModule/sponsor/sponsorShip.module';
import SponsorshipPaymentModule from 'src/modules/sponsorModule/sponsorshipPayment/sponsorshipPayment.module';

const SponsorshipModules = [
  FixNeedModule,
  SponsorShipModule,
  MessageModule,
  SponsorshipPaymentModule,
];

@Module({ imports: SponsorshipModules, exports: SponsorshipModules })
export default class SponsorshipMainModule {}
