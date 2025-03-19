import { Module, forwardRef } from '@nestjs/common';
import SponsorshipService from 'src/modules/sponsorModule/sponsor/sponsorShip.service';
import DatabaseModule from 'src/database/main/database.module';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [SponsorshipService],
  exports: [SponsorshipService],
})
export default class SponsorShipModule {}
