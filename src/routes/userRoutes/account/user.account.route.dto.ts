import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { CityEnum, NationalityEnum } from 'src/database/user';

export class UserIDImages {
  @IsNotEmpty({ message: 'Please insert front image of your ID' })
  frontId: Express.Multer.File[];

  @IsNotEmpty({ message: 'Please insert back image of your ID' })
  backId: Express.Multer.File[];
}

export class UserRegisterDTO {
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @IsNotEmpty({ message: 'Lastname cannot be empty' })
  lastname: string;

  /* @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })*/
  @IsNotEmpty({
    message:
      'Password should has at least 1 lowercase,1 number,1 symbol and at least 6 character long',
  })
  password: string;

  @IsNotEmpty({ message: 'Should be email' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'date' })
  dateOfBirth: Date;

  @IsNotEmpty({ message: 'Should be selected' })
  city: CityEnum;

  @IsNotEmpty({ message: 'Please enter your ID number' })
  @Length(10, 10, { message: 'Should be 10' })
  @IsNumberString()
  idNumber: string;

  // @IsNotEmpty({ message: 'Please upload front page of id' })
  // frontId: Express.Multer.File;

  // @IsNotEmpty({ message: 'Please upload back page of id' })
  // backId: Express.Multer.File;
}
