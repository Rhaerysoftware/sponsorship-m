import { Injectable } from '@nestjs/common';
import UserRequestService from 'src/modules/userModule/userRequest/userRequest.service';
import { AnswerDTO } from 'src/routes/authorityRoutes/userRequest/userRequest.route.dto';
import { IUserCookie } from 'shared/types';
import UserService from 'src/modules/userModule/userModule/user.service';

@Injectable()
export default class UserRequestRouteService {
  constructor(
    private userRequestService: UserRequestService,
    private userService: UserService,
  ) {}

  public async getRequests(authority: IUserCookie, page: number) {
    const requests = await this.userRequestService.getAwaitingUsers(
      authority.city,
      page,
    );

    return requests;
  }

  public async getUser(userId: number) {
    return await this.userService.getUserActor(userId);
  }

  public async answerRequest(requestId: number, body: AnswerDTO) {
    return await this.userRequestService.asnwerRequest(requestId, body.answer);
  }
}
