import { DataSource } from 'typeorm';
import { checkIfClassIsEntity, generateName } from 'src/database/utils/util';
import { Provider, Inject } from '@nestjs/common';

export const createRepositoryProvider = <T extends new (...args: any[]) => any>(
  entity: T,
): Provider => {
  if (!checkIfClassIsEntity(entity)) throw new Error('Baba Olmaz');

  return {
    provide: generateName(entity),
    useFactory: async (dataSource: DataSource) =>
      dataSource.getRepository(entity),
    inject: ['SPONSORSHIP'],
  };
};

export const Injector = <T extends new (...args: any[]) => any>(entity: T) =>
  Inject(generateName(entity));
