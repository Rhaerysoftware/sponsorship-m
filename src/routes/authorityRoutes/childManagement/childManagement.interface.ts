import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { CityEnum } from 'src/database/user';
import Child from 'src/database/user/child/child.entity';
import {
  ICreateChild,
  IFilterChilds,
  ISortChilds,
} from 'src/modules/userModule/childModule/child.module.interface';

export interface IListChildsQuery {
  page: number;
}

export class CreateChildDTO implements ICreateChild {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsNotEmpty()
  story: string;
}

export class EditChildDTO implements Partial<ICreateChild> {
  @IsOptional()
  name?: string;
  @IsOptional()
  lastname?: string;
  @IsOptional()
  dateOfBirth?: Date;
  @IsOptional()
  story?: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  password?: string;
}

export class ListChildDTO {
  @IsOptional()
  filters?: IFilterChilds;

  @IsOptional()
  sort?: ISortChilds;
}
