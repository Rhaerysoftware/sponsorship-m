import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import UserMessageRouteController from 'src/routes/userRoutes/message/userMessage.route.controller';
import UserMessageRotueService from 'src/routes/userRoutes/message/userMessage.route.service';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule)],
  controllers: [UserMessageRouteController],
  providers: [UserMessageRotueService],
})
export default class UserMessageRotueModule {}
