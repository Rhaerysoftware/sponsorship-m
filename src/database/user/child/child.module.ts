import { DataSource } from 'typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import Child from 'src/database/user/child/child.entity';
import ChildDAO from 'src/database/user/child/child.DAO';
import DatabaseModule from 'src/database/main/database.module';

const ChildProvider = createRepositoryProvider(Child);

@Module({
  imports: [forwardRef(() => DatabaseModule) /*DatabaseModule*/],
  providers: [ChildProvider, ChildDAO],
  exports: [ChildDAO],
})
export default class ChildEntityModule {}
