import { IsNotEmpty } from 'class-validator';

export class UpdateFixNeedDTO {
  title: string;

  explanation: string;

  amount: number;
}

export class CreateFixNeedDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  amount: number;
}
