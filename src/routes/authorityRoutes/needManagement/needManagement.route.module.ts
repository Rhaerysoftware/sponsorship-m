import {
  Module,
  NestModule,
  MiddlewareConsumer,
  forwardRef,
} from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import NeedManagmentRouteController from 'src/routes/authorityRoutes/needManagement/needManagement.route.controller';
import NeedManagementRouteService from 'src/routes/authorityRoutes/needManagement/needManagement.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  providers: [NeedManagementRouteService],
  controllers: [NeedManagmentRouteController],
})
export default class NeedManagementRouteModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
