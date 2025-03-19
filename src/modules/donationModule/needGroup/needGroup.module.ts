import { Module, forwardRef } from '@nestjs/common';
import DatabaseModule from 'src/database/main/database.module';
import NeedGroupService from 'src/modules/donationModule/needGroup/needGroup.service';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [NeedGroupService],
  exports: [NeedGroupService],
})
export default class NeedGroupModule {}
