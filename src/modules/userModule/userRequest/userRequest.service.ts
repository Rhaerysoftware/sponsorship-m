import { Injectable } from '@nestjs/common';
import { CityEnum, Status } from 'src/database/user';
import UserDAO from 'src/database/user/user/user.DAO';
import User from 'src/database/user/user/user.entity';
import UserRequestDAO from 'src/database/user/userRequest/userRequest.DAO';
import FileService, { IIDFile } from 'src/services/file/file.service';

export interface UserWithIDImages extends User {
  idIamges: IIDFile;
}

@Injectable()
export default class UserRequestService {
  constructor(
    private userRequestDAO: UserRequestDAO,
    private userDAO: UserDAO,
    private fileService: FileService,
  ) {}

  private joinUserAndID(user: User, ID: IIDFile) {
    // (user as UserWithIDImages).idIamges = ID;
    return user;
  }

  private getUserRequestIDs(users: User[]) {
    const userFiles = users.map((user) =>
      this.joinUserAndID(
        user,
        this.fileService.getFile(user, 'identification'),
      ),
    );

    return userFiles;
  }

  public async getAwaitingUsers(city: CityEnum, page: number) {
    const requests = await this.userDAO.getUserswithRequests(
      Status.WAITING,
      {
        page,
        city,
      },
      10,
    );

    const requestsWithIDs = this.getUserRequestIDs(requests);

    console.log(requestsWithIDs);

    return requestsWithIDs;
  }

  public async asnwerRequest(
    requestId: number,
    answer: Status.APPROVED | Status.DENIED,
  ) {
    const request = await this.userRequestDAO.answerUserRequest(
      requestId,
      answer,
    );

    const requestUser = request.user;

    if (!requestUser) throw new Error('Sıkıntı var');

    if (answer === Status.DENIED) {
      request.user.canLogin = false;
    } else {
      request.user.canLogin = true;
    }

    await this.userDAO.saveUserEntity(request.user);

    return request;
  }
}
