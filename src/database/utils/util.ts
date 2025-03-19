import { getMetadataArgsStorage } from 'typeorm';

export const checkIfClassIsEntity = <T extends new (...args: any[]) => any>(
  entity: T,
) => !!getMetadataArgsStorage().tables.find((table) => table.target === entity);

export const generateName = <T extends new (...args: any[]) => any>(
  entity: T,
) => {
  const name = entity.name.toLocaleUpperCase('en') + '_REPOSITORY';
  return name;
};
