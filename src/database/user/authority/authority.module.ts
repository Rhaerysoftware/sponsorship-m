import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import Authority from 'src/database/user/authority/authority.entity';
import AuthorityDAO from 'src/database/user/authority/authority.DAO';
import DatabaseModule from 'src/database/main/database.module';

const AuthorityProvider = createRepositoryProvider(Authority);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [AuthorityProvider, AuthorityDAO],
  exports: [AuthorityDAO],
})
export default class AuthorityEntityModule {}
