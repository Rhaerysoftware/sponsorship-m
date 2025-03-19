import { Module, Global, forwardRef } from '@nestjs/common';
import DatabaseModule from 'src/database/main/database.module';
import UserEntityModule from 'src/database/user/user/userEntity.module';
import UserRequestEntityModule from 'src/database/user/userRequest/userRequestEntity.module';
import UserRequestService from 'src/modules/userModule/userRequest/userRequest.service';

@Global()
@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [UserRequestService],
  exports: [UserRequestService],
})
export default class UserRequestModule {}
