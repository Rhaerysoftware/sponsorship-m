import { Module, forwardRef } from '@nestjs/common';
import DatabaseModule from 'src/database/main/database.module';
import MessageService from 'src/modules/sponsorModule/messageModule/message.service';
import ActorMainModule from 'src/modules/userModule/actors.main.module';

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [MessageService],
  exports: [MessageService],
})
export default class MessageModule {}
