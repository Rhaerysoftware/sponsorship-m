import Answer from 'src/database/user/answer/answer.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Index,
} from 'typeorm';

@Entity()
export default class Question {
  @Index()
  @PrimaryGeneratedColumn()
  quetionId: number;

  @Column('varchar')
  question: string;

  @OneToOne(() => Answer, (answer) => answer.question)
  answer: Answer;
}
