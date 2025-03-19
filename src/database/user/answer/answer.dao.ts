import { Repository, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import { ServerError } from 'src/utils/error';
import Answer from 'src/database/user/answer/answer.entity';
import Question from 'src/database/user/question/question.entity';
import QuestionDAO from 'src/database/user/question/question.DAO';

@Injectable()
export default class AnswerDAO {
  @Injector(Answer) private answerRepository: Repository<Answer>;
  private questionDAO: QuestionDAO;

  private async saveAnswerEntity(entity: Answer) {
    return await this.answerRepository.save(entity);
  }

  public async createAnswer(
    questionParams: FindOptionsWhere<Question>,
    answerMessage: string,
  ) {
    if (!answerMessage) throw new ServerError('The Answer cannot empty');

    const question = await this.questionDAO.getQuestion(questionParams);

    const answer = this.answerRepository.create({
      answer: answerMessage,
      question,
    });

    return await this.saveAnswerEntity(answer);
  }
}
