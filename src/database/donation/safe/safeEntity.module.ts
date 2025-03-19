import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import Safe from 'src/database/donation/safe/safe.entity';
import SafeDAO from 'src/database/donation/safe/safe.DAO';
import DatabaseModule from 'src/database/main/database.module';

const SafeEntityProvider = createRepositoryProvider(Safe);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [SafeEntityProvider, SafeDAO],
  exports: [SafeDAO],
})
export default class SafeEntityModule {}
