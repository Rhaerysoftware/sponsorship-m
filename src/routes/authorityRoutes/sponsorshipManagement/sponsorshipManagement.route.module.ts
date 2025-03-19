import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import SponsorshipManagementRouteController from 'src/routes/authorityRoutes/sponsorshipManagement/sponsorshipManagement.route.controller';
import SponsorshipManagementRouteService from 'src/routes/authorityRoutes/sponsorshipManagement/sponsorshipManagement.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  providers: [SponsorshipManagementRouteService],
  controllers: [SponsorshipManagementRouteController],
})
export default class SponsorshipManagementRouteModule {}
