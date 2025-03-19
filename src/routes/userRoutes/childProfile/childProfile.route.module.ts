import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import ChildProfileRouteController from 'src/routes/userRoutes/childProfile/childProfile.route.controller';
import ChildProfileRouteService from 'src/routes/userRoutes/childProfile/childProfile.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  controllers: [ChildProfileRouteController],
  providers: [ChildProfileRouteService],
})
export default class ChildProfileRouteModule {}
