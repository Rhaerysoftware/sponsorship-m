import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import DatabaseModule from 'src/database/main/mysql.connector.module';
import ChildStatusDAO from 'src/database/user/childStatus/childStatus.DAO';
import ChildStatus from 'src/database/user/childStatus/childStatus.entity';

const ChildStatusProvider = createRepositoryProvider(ChildStatus);

@Module({
  imports: [forwardRef(() => DatabaseModule) /*DatabaseModule*/],
  providers: [ChildStatusProvider, ChildStatusDAO],
  exports: [ChildStatusDAO],
})
export default class ChildStatusEntityModule {}
