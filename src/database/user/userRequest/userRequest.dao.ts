import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import UserRequest from 'src/database/user/userRequest/userRequest.entity';
import { CityEnum, Status } from 'src/database/user';
import { NotFound } from 'src/utils/error';

@Injectable()
export default class UserRequestDAO {
  constructor(
    @Injector(UserRequest)
    private userRequestRepository: Repository<UserRequest>,
  ) {}

  private async saveUserRequestEntity(entity: UserRequest) {
    return await this.userRequestRepository.save(entity);
  }

  public async createLoginRequest(userRequestParm: DeepPartial<UserRequest>) {
    const userRequestInstance =
      this.userRequestRepository.create(userRequestParm);

    return await this.saveUserRequestEntity(userRequestInstance);
  }

  public async getUserRequest(
    userRequestParams: FindOptionsWhere<UserRequest>,
  ) {
    const userRequest = await this.userRequestRepository.findOne({
      where: { ...userRequestParams },
      relations: { user: true },
    });

    if (!userRequest) throw new NotFound('User Request is Not Fopund');

    return userRequest;
  }

  public async answerUserRequest(
    requestId: number,
    answer: Status.APPROVED | Status.DENIED,
  ) {
    const userRequest = await this.getUserRequest({ requestId });
    userRequest.status = answer;

    return await this.saveUserRequestEntity(userRequest);
  }
}
