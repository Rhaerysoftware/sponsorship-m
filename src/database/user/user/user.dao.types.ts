import { CityEnum } from 'src/database/user';

export interface IUserRequestFilters {
  city?: CityEnum;
  page: number;
}

export interface ISkipTake {
  skip: number;
}
