import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Index,
} from 'typeorm';
import Question from 'src/database/user/question/question.entity';
import User from 'src/database/user/user/user.entity';

@Entity()
export default class Answer {
  @Index()
  @PrimaryGeneratedColumn()
  answerId: number;

  @Column('varchar')
  answer: string;

  @OneToOne(() => Question, (question) => question.answer)
  question: Question;

  @OneToOne(() => User, (user) => user.answer)
  user: User;
}
