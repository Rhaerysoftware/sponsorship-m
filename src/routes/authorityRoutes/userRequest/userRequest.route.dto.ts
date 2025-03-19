import { IsNotEmpty } from 'class-validator';
import { Status } from 'src/database/user';

export type TAnswer = Status.APPROVED | Status.DENIED;

export class AnswerDTO {
  @IsNotEmpty({ message: 'Answer' })
  answer: TAnswer;
}
