import { IsNotEmpty, IsEmail, Length } from 'class-validator';
import { User } from 'src/database/main/entities';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  // @Length(8, 20, { message: 'Plase enter enter pass min 8 max 20 charachters' })
  password: string;
}

export class ListPaginationDto {
  @IsNotEmpty()
  public page: number;

  public resultsPerPage: number;
}
