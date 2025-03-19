import { IsNotEmpty } from 'class-validator';

export interface ICreateChild {
  name: string;
  lastname: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  story: string;
}

export interface IFilterChilds {
  name?: string;
  lastname?: string;
  idNumber?: number;
  age?: number;
}

export interface ISortChilds {
  sortBy?: keyof IFilterChilds;
  way?: 'ASC' | 'DESC';
}
