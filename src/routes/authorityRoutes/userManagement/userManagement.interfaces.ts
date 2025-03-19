import { IsOptional } from 'class-validator';

export interface IFilterUser {
  name?: string;
  lastname?: string;
  idNumber?: number;
}

export class ListUserDTO {
  @IsOptional()
  filters?: IFilterUser;
}
