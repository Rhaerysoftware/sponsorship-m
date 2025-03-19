import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import ChildInNeedRouteController from 'src/routes/userRoutes/childInNeed/childInNeed.route.controller';
import ChildInNeedRouteService from 'src/routes/userRoutes/childInNeed/childInNeed.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  controllers: [ChildInNeedRouteController],
  providers: [ChildInNeedRouteService],
})
export default class ChildInNeedRouteModule {}
