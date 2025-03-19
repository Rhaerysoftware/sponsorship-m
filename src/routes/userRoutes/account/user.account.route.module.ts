import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import UserAccountRouteController from 'src/routes/userRoutes/account/user.account.route.controller';
import UserAccountRouteService from 'src/routes/userRoutes/account/user.account.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  providers: [UserAccountRouteService],
  controllers: [UserAccountRouteController],
})
export default class UserAccountRouteModule {}
