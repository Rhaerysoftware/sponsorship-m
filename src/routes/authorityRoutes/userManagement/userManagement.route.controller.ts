import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/database/user';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';
import UserManagementRouteService from 'src/routes/authorityRoutes/userManagement/userManagement.route.service';
import { IUserCookie } from 'shared/types';
import { ListUserDTO } from 'src/routes/authorityRoutes/userManagement/userManagement.interfaces';

@UseInterceptors(new CookieInterceptor(Role.Authority))
@Controller('authority/userManagement')
export default class UserManagementRouteController {
  constructor(private userManagementRouteService: UserManagementRouteService) {}

  @Get('getUserSponsorships/:userId')
  public async GetUserSponosredChilds(
    @Param('userId') userId: number,
    @User(Role.Authority) authority: IUserCookie,
  ) {
    const userSponosrships =
      await this.userManagementRouteService.getUserSponosredChilds(userId);

    return { ok: true, message: '', data: userSponosrships };
  }

  @Get('getUser/:userId')
  public async GetUser(
    @Param('userId', ParseIntPipe) userId: number,
    @User(Role.Authority) authority: IUserCookie,
  ) {
    const user = await this.userManagementRouteService.getUser(
      authority,
      userId,
    );

    return { ok: true, message: 'User Retrieved', data: user };
  }

  @Delete('blockUser/:userId')
  public async BlockUser(
    @Param('userId', ParseIntPipe) userId: number,
    @User(Role.Authority) authority: IUserCookie,
  ) {
    const blockedUser = await this.userManagementRouteService.blockUser(userId);

    return { ok: true, message: 'User Blocked', data: blockedUser };
  }

  @Post('listUsers/:page')
  public async ListChilds(
    @Param('page', ParseIntPipe) page: number,
    @User(Role.Authority) authority: IUserCookie,
    @Body() requestBody: ListUserDTO,
  ) {
    const result = await this.userManagementRouteService.listUsers(
      requestBody,
      page,
      authority,
    );
    return {
      ok: true,
      message: 'Childs Are Retrieved',
      data: result,
    };
  }
}
