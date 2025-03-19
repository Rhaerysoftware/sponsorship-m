import { Injectable } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import { Repository } from 'typeorm';
import {
  ChildStatusWhere,
  DeepPartialChildStatus,
  SearchChildStatusParams,
} from 'src/database/user/childStatus/childStatus.DAO.interface';
import ChildStatus from 'src/database/user/childStatus/childStatus.entity';
import { NotFound } from 'src/utils/error';

@Injectable()
export default class ChildStatusDAO {
  constructor(
    @Injector(ChildStatus)
    private childStatusRepoistory: Repository<ChildStatus>,
  ) {}

  private async saveChildStatusEntity(entity: ChildStatus) {
    return await this.childStatusRepoistory.save(entity);
  }

  public async getChildStatus(where: ChildStatusWhere) {
    const childStatus = await this.childStatusRepoistory.findOne({ where });

    if (!childStatus) throw new NotFound('Child Status Not Found');

    return childStatus;
  }

  public async createChildStatus(childStatusParams: DeepPartialChildStatus) {
    const childStatusInstance =
      this.childStatusRepoistory.create(childStatusParams);

    return await this.saveChildStatusEntity(childStatusInstance);
  }

  public async updateChildStatus(
    searchParams: SearchChildStatusParams,
    childStatusUpdateParams: DeepPartialChildStatus,
  ) {
    const child = await this.getChildStatus({});

    const updatedInstance = await this.childStatusRepoistory.save({
      ...child,
      ...childStatusUpdateParams,
    });

    return updatedInstance;
  }

  public async deleteChildStatus(searchParams: SearchChildStatusParams) {
    const childStatus = await this.getChildStatus(searchParams);

    childStatus.isDeleted = true;

    const deletedInstance = await this.childStatusRepoistory.save(childStatus);

    return deletedInstance;
  }
}
