import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import UserSponsorshipManagementController from 'src/routes/userRoutes/sponsorshipManagement/userSponsorshipManagement.route.controller';
import UserSponsorshipManagementRouteService from 'src/routes/userRoutes/sponsorshipManagement/userSponsorshipManagement.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  controllers: [UserSponsorshipManagementController],
  providers: [UserSponsorshipManagementRouteService],
})
export default class UserSponsorshipManagementRouteModule {}
