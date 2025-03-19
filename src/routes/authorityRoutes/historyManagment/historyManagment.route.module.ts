import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import HistoryManagementRouteController from 'src/routes/authorityRoutes/historyManagment/historyManagement.route.controller';
import HistoryManagementRouteService from 'src/routes/authorityRoutes/historyManagment/historyManagement.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  controllers: [HistoryManagementRouteController],
  providers: [HistoryManagementRouteService],
})
export default class HistoryManagementRouteModule {}
