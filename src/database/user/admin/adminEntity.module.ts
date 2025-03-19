import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import AdminDAO from 'src/database/user/admin/admin.DAO';
import Admin from 'src/database/user/admin/admin.entity';
import DatabaseModule from 'src/database/main/database.module';

const AdminProvider = createRepositoryProvider(Admin);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [AdminProvider, AdminDAO],
  exports: [AdminDAO],
})
export default class AdminEntityModule {}
