import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import UserManagementRouteController from 'src/routes/authorityRoutes/userManagement/userManagement.route.controller';
import UserManagementRouteService from 'src/routes/authorityRoutes/userManagement/userManagement.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  controllers: [UserManagementRouteController],
  providers: [UserManagementRouteService],
})
export default class UserManagementRouteModule {}
