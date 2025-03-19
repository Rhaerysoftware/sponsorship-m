import { Module } from '@nestjs/common';
import AuthorityRoutesModule from 'src/routes/authorityRoutes/authority.route.module';
import ChildRoutesModule from 'src/routes/childRoutes/childRoutes.module';
import UserRoutesModule from 'src/routes/userRoutes/user.route.module';

const BusinnessRoutes = [
  AuthorityRoutesModule,
  ChildRoutesModule,
  UserRoutesModule,
];

@Module({
  imports: BusinnessRoutes,
})
export default class BusinnessRouteModule {}
{
}
