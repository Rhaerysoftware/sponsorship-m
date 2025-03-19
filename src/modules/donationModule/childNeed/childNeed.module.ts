import { Module, forwardRef } from '@nestjs/common';
import ChildNeedService from 'src/modules/donationModule/childNeed/childNeed.service';
import DatabaseModule from 'src/database/main/database.module';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [ChildNeedService],
  exports: [ChildNeedService],
})
export default class ChildNeedModule {}
