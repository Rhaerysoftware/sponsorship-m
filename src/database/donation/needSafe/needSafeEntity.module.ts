import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import NeedSafe from 'src/database/donation/needSafe/needSafe.entity';
import NeedSafeDAO from 'src/database/donation/needSafe/needSafe.DAO';
import DatabaseModule from 'src/database/main/database.module';

const NeedSafeProvider = createRepositoryProvider(NeedSafe);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [NeedSafeProvider, NeedSafeDAO],
  exports: [NeedSafeDAO],
})
export default class NeedSafeEntityModule {}
