import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import UserDAO from 'src/database/user/user/user.DAO';
import User from 'src/database/user/user/user.entity';
import DatabaseModule from 'src/database/main/database.module';

const UserProvider = createRepositoryProvider(User);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [UserProvider, UserDAO],
  exports: [UserDAO],
})
export default class UserEntityModule {}
