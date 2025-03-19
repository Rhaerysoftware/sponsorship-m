import { Injectable } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import { DeepPartial, Repository } from 'typeorm';
import { ActorType } from 'src/database/user';
import BaseUser from 'src/database/user/baseUser';
import Identification from 'src/database/user/identification/identification.entity';

@Injectable()
export default class IdentificationDAO {
  constructor(
    @Injector(Identification)
    private identificationRepository: Repository<Identification>,
  ) {}

  private async saveIdentificationEntity(entity: Identification) {
    return await this.identificationRepository.save(entity);
  }

  public async createIdentification(
    user: BaseUser,
    data: DeepPartial<Identification>,
    userType: ActorType,
  ) {
    const createdIdentification = this.identificationRepository.create({
      ...data,
      [userType]: { ...user },
    });
    return await this.saveIdentificationEntity(createdIdentification);
  }
}
