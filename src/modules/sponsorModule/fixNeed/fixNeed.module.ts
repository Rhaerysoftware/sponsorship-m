import { Module, forwardRef } from '@nestjs/common';
import FixNeedService from 'src/modules/sponsorModule/fixNeed/fixNeed.service';
import DatabaseModule from 'src/database/main/database.module';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [FixNeedService],
  exports: [FixNeedService],
})
export default class FixNeedModule {}
