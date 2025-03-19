import {
  Module,
  forwardRef,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import FixNeedManagementRouteController from 'src/routes/authorityRoutes/fixNeedManagement/fixNeedManagement.route.controller';
import FixNeedManagementRouteService from 'src/routes/authorityRoutes/fixNeedManagement/fixNeedMangement.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  controllers: [FixNeedManagementRouteController],
  providers: [FixNeedManagementRouteService],
})
export default class FixNeedManagementRouteModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(CookieMiddlewareMixin(Role.Authority)).forRoutes('*');
  }
}
