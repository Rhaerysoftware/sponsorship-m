import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import ChildAccountRouteController from 'src/routes/childRoutes/account/child.route.account.controller';
import ChildAccountRouteService from 'src/routes/childRoutes/account/child.route.account.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  providers: [ChildAccountRouteService],
  controllers: [ChildAccountRouteController],
})
export default class ChildAccountRouteModule {}
