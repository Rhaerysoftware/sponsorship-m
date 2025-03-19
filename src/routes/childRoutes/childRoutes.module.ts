import { Module } from '@nestjs/common';
import ChildAccountRouteModule from 'src/routes/childRoutes/account/child.route.account.module';
import ChildMessageRotueModule from 'src/routes/childRoutes/message/childMessage.route.module';

const ChildRoutes = [ChildAccountRouteModule, ChildMessageRotueModule];

@Module({
  imports: ChildRoutes,
  exports: ChildRoutes,
})
export default class ChildRoutesModule {}
