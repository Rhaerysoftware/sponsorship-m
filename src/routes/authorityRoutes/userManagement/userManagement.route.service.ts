import { Injectable } from '@nestjs/common';
import SponsorshipService from 'src/modules/sponsorModule/sponsor/sponsorShip.service';
import UserService from 'src/modules/userModule/userModule/user.service';
import { IUserCookie } from 'shared/types';
import { ListUserDTO } from 'src/routes/authorityRoutes/userManagement/userManagement.interfaces';

@Injectable()
export default class UserManagementRouteService {
  constructor(
    private userService: UserService,
    private sponsorshipService: SponsorshipService,
  ) {}

  public async getUser(authority: IUserCookie, userId: number) {
    return await this.userService.getUserActor(userId);
  }

  public async getUserSponosredChilds(userId: number) {
    return await this.userService.getAllSponsorshipsOfUser(userId);
  }

  public async blockUser(userId: number) {
    return await this.userService.blockUser(userId);
  }

  public async listUsers(
    requestBody: ListUserDTO,
    page: number,
    authority: IUserCookie,
  ) {
    return await this.userService.listUser(requestBody, page);
  }
}
