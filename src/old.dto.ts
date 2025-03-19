import {
  IsNotEmpty,
  Length,
  IsNumberString,
  IsEmail,
  MinLength,
} from 'class-validator';
import Child from 'src/database/user/child/child.entity';
import { CityEnum, NationalityEnum } from 'src/database/user';
import { ListPaginationDto } from 'shared/dtos';

class IdentificationDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 11)
  public idNumber: string;

  @IsNotEmpty()
  public nationality: NationalityEnum;
}

export class CreateChildDto {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public lastname: string;

  @IsNotEmpty()
  public dateOfBirth: Date;

  @IsNotEmpty()
  public city: CityEnum;

  @IsNotEmpty()
  public story: string;

  public file: Express.Multer.File;

  public identification: IdentificationDto;
}

export class UpdateChildDto extends Child {}

export class ChildPagination extends ListPaginationDto {
  public fullNameLike: string;

  public age: number;
}

export class AuthorityLoginBody {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email is wrong' })
  public email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password should be at least 8 charachters' })
  public password: string;
}
