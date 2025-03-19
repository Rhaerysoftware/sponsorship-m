import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import DatabaseModule from 'src/database/main/database.module';
import MessageDAO from 'src/database/sponsor/message/message.dao';
import Message from 'src/database/sponsor/message/message.entity';

const MessageProvider = createRepositoryProvider(Message);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [MessageProvider, MessageDAO],
  exports: [MessageDAO],
})
export default class MessageEntityModule {}
