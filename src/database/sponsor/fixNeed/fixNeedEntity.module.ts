import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import FixNeedDAO from 'src/database/sponsor/fixNeed/fixNeed.DAO';
import FixNeed from 'src/database/sponsor/fixNeed/fixNeed.entity';
import DatabaseModule from 'src/database/main/database.module';

const FixNeedProvder = createRepositoryProvider(FixNeed);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [FixNeedProvder, FixNeedDAO],
  exports: [FixNeedDAO],
})
export default class FixNeedEntityModule {}
