import { Module, forwardRef } from '@nestjs/common';
import BusinnessLogicModule from 'src/modules/businnes.logic.module';
import UserRequestController from 'src/routes/authorityRoutes/userRequest/userRequest.controller';
import UserRequestRouteService from 'src/routes/authorityRoutes/userRequest/userRequest.route.service';
import FileModule from 'src/services/file/file.module';

@Module({
  imports: [forwardRef(() => BusinnessLogicModule), FileModule],
  providers: [UserRequestRouteService],
  controllers: [UserRequestController],
})
export default class UserRequestRouteModule {}
