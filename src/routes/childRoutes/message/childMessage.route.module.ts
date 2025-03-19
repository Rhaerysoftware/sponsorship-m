import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import ChildMessageRouteController from 'src/routes/childRoutes/message/childMessage.route.controller';
import ChildMessageRotueService from 'src/routes/childRoutes/message/childMessage.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  controllers: [ChildMessageRouteController],
  providers: [ChildMessageRotueService],
})
export default class ChildMessageRotueModule {}
