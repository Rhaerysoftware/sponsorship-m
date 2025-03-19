import { Repository, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import { NotFound } from 'src/utils/error';
import Question from 'src/database/user/question/question.entity';

@Injectable()
export default class QuestionDAO {
  @Injector(Question) private questionRepository: Repository<Question>;

  public async getQuestion(questionParams: FindOptionsWhere<Question>) {
    const question = await this.questionRepository.findOne({
      where: { ...questionParams },
    });

    if (!question) throw new NotFound('The Question is Not Found');

    return question;
  }

  public async getAllQuestions() {
    const allQuestions = await this.questionRepository.find();

    if (allQuestions.some((q) => !!q)) {
      throw new NotFound('Some or All Questions is Empty');
    }

    return allQuestions;
  }
}
