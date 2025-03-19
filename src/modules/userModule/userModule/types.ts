import { CityEnum, NationalityEnum } from 'src/database/user';

export class UserIDImages {
  frontId: Express.Multer.File[];
  backId: Express.Multer.File[];
}

export interface IIdentification {
  nationality: NationalityEnum;
  idNumber: string;
  files: UserIDImages;
}

export interface IRegisterUser {
  name: string;
  lastname: string;
  email: string;
  password: string;
  city: CityEnum;
  identifications: IIdentification[];
  dateOfBirth: Date;
}
