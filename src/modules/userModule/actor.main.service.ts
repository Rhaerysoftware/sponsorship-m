import { Injectable } from '@nestjs/common';
import { Role } from 'src/database/user';
import ChildService from 'src/modules/userModule/childModule/child.service';
import UserService from 'src/modules/userModule/userModule/user.service';

@Injectable()
export default class ActorMainService {
  constructor(
    private childService: ChildService,
    private userService: UserService,
  ) {}

  public async getUser(role: Role, userId: number) {
    return await this.userService.getUser({ userId }, role);
  }
}
