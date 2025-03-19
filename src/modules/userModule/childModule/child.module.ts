import { Module, forwardRef } from '@nestjs/common';
import ChildStatusEntityModule from 'src/database/user/childStatus/childStatusEntityModule.module';
import ChildEntityModule from 'src/database/user/child/child.module';
import ChildService from 'src/modules/userModule/childModule/child.service';
import SafeEntityModule from 'src/database/donation/safe/safeEntity.module';
import DatabaseModule from 'src/database/main/database.module';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [ChildService],
  exports: [ChildService],
})
export default class ChildModule {}
