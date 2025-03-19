import {
  Get,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { Role } from 'src/database/user';
import { IUserCookie } from 'shared/types';
import {
  CreateChildDTO,
  EditChildDTO,
  ListChildDTO,
} from 'src/routes/authorityRoutes/childManagement/childManagement.interface';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';
import ChildManagementRouteService from 'src/routes/authorityRoutes/childManagement/childManagement.route.service';
import { ICreateChild } from 'src/modules/userModule/childModule/child.module.interface';

@UseInterceptors(new CookieInterceptor(Role.Authority))
@Controller('authority/childManagement')
export default class ChildManagementRouteController {
  constructor(
    private childManagementRouteService: ChildManagementRouteService,
  ) {}

  @Post('createChild')
  public async CreateChild(
    @User(Role.Authority) authority: IUserCookie,
    @Body() requestBody: CreateChildDTO,
  ) {
    const createdChild = await this.childManagementRouteService.createChild(
      authority,
      requestBody,
    );

    return { ok: true, message: 'Child Has Been Created', data: createdChild };
  }

  @Get('getChildCard/:childId')
  public async GetChild(@Param('childId', ParseIntPipe) childId: number) {
    const child = await this.childManagementRouteService.getChildCard(childId);

    return { ok: true, message: 'Child Retrieved', data: child };
  }

  @Post('editChild/:childId')
  public async EditChild(
    @Param('childId', ParseIntPipe) childId: number,
    @User(Role.Authority) authority: IUserCookie,
    @Body() requestBody: EditChildDTO,
  ) {
    const editedChild = await this.childManagementRouteService.editChild(
      authority,
      childId,
      requestBody,
    );

    return { ok: true, message: 'Child is Edited', data: editedChild };
  }

  @Delete('deleteChild/:childId')
  public async DeleteChild(
    @Param('childId', ParseIntPipe) childId: number,
    @User(Role.Authority) authority: IUserCookie,
  ) {
    const deletedChild = await this.childManagementRouteService
      .deleteChild(childId, authority)
      .catch((err) => console.error(err));

    return { ok: true, message: 'Child is deleted', data: deletedChild };
  }

  @Post('listChilds/:page')
  public async ListChilds(
    @Param('page', ParseIntPipe) page: number,
    @User(Role.Authority) authority: IUserCookie,
    @Body() requestBody: ListChildDTO,
  ) {
    const result = await this.childManagementRouteService.listChilds(
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
