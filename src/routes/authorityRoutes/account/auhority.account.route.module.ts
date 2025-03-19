import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import AuthorityRouteController from 'src/routes/authorityRoutes/account/authority.account.route.controller';
import AuthorityAccountService from 'src/routes/authorityRoutes/account/authority.account.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  providers: [AuthorityAccountService],
  controllers: [AuthorityRouteController],
})
export default class AuthorityAccountRouteModule {}
