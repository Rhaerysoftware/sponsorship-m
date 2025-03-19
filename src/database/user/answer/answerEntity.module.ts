import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import Answer from 'src/database/user/answer/answer.entity';
import AnswerDAO from 'src/database/user/answer/answer.DAO';
import DatabaseModule from 'src/database/main/database.module';

const AnswerProvider = createRepositoryProvider(Answer);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [AnswerProvider, AnswerDAO],
  exports: [AnswerDAO],
})
export default class AnswerEntityModule {}
