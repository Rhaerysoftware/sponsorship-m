import { DeepPartial, FindOptionsWhere } from 'typeorm';
import ChildStatus from 'src/database/user/childStatus/childStatus.entity';

export type DeepPartialChildStatus = DeepPartial<ChildStatus>;

export type ChildStatusWhere = FindOptionsWhere<ChildStatus>;

export interface SearchChildStatusParams {
  statusId: number;
}
