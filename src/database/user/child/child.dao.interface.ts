import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { CityEnum } from 'src/database/user';
import Child from 'src/database/user/child/child.entity';

export type ChildWhere = FindOptionsWhere<Child>;
export type DeepPartialChild = DeepPartial<Child>;

export interface IListedChild {
  name: string;
  lastname: string;
  city: CityEnum;
  age: number;
  idNumber: string;
}
