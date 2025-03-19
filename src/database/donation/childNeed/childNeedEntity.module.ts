import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import ChildNeedDAO from 'src/database/donation/childNeed/childNeed.DAO';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';
import DatabaseModule from 'src/database/main/database.module';

const ChildNeedProvider = createRepositoryProvider(ChildNeed);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [ChildNeedProvider, ChildNeedDAO],
  exports: [ChildNeedDAO],
})
export default class ChildNeedEntityModule {}
