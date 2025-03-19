import { CityEnum, Role } from 'src/database/user';
import { Request } from 'express';

export interface IUserCookie {
  userId: number;
  name: string;
  lastname: string;
  fullName: string;
  email: string;
  role: Role;
  city: CityEnum;
}

export interface ExtendedRequest extends Request {
  user?: IUserCookie;
}

export interface IPaginationData<ResultType> {
  result: ResultType[];
  count: number;
}

export interface IPaginate<FilterType, SortType> {
  filters: FilterType;
  sortBy: SortType;
  page: number;
}
