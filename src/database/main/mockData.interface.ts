import { DeepPartial, EntityTarget, EntityManager } from 'typeorm';
import { faker } from '@faker-js/faker';

export type CreateManager = typeof EntityManager.prototype.create;
export type SaveManager = typeof EntityManager.prototype.save;
export type ArrayGenerator<Entity, Count> = Count extends number
  ? Entity[]
  : Entity;

export type ReturnCount<T, Entity> = T extends undefined ? Entity : Entity[];

export type ManagerCreate<Entity> = (
  entityClass: EntityTarget<Entity>,
  plainObject?: DeepPartial<Entity>,
) => Entity;

export type IOptions = {
  count?:
    | number
    | {
        min: number;
        max: number;
      };
};
export type Multiplier = typeof faker.helpers.multiple;

export interface DatabaseOption {
  dialect: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}
