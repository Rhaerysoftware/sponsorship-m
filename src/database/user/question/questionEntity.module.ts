import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import QuestionDAO from 'src/database/user/question/question.DAO';
import Question from 'src/database/user/question/question.entity';
import DatabaseModule from 'src/database/main/database.module';

const QuestionProvider = createRepositoryProvider(Question);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [QuestionProvider, QuestionDAO],
  exports: [QuestionDAO],
})
export default class QuestionEntityModule {}
