import { Module, forwardRef } from '@nestjs/common';

import DatabaseModule from 'src/database/main/database.module';
import UserService from 'src/modules/userModule/userModule/user.service';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [UserService],
  exports: [UserService],
})
export default class UserModule {}
