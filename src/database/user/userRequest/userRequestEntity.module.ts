import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import UserRequestDAO from 'src/database/user/userRequest/userRequest.DAO';
import UserRequest from 'src/database/user/userRequest/userRequest.entity';
import DatabaseModule from 'src/database/main/database.module';

const UserRequestProvider = createRepositoryProvider(UserRequest);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [UserRequestProvider, UserRequestDAO],
  exports: [UserRequestDAO],
})
export default class UserRequestEntityModule {}
