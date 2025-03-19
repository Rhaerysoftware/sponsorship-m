import { Module, forwardRef } from '@nestjs/common';
import SafeService from 'src/modules/donationModule/safe/safe.service';
import DatabaseModule from 'src/database/main/database.module';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [SafeService],
  exports: [SafeService],
})
export default class SafeModule {}
