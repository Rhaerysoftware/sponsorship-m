import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import NeedGroupDAO from 'src/database/donation/needGroup/needGroup.DAO';
import NeedGroup from 'src/database/donation/needGroup/needGroup.entity';
import DatabaseModule from 'src/database/main/database.module';

export const NeedGroupProvider = createRepositoryProvider(NeedGroup);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [NeedGroupProvider, NeedGroupDAO],
  exports: [NeedGroupDAO],
})
export default class NeedGroupEntityModule {}
