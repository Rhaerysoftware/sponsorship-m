import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { Role } from 'src/database/user';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { IUserCookie } from 'shared/types';
import {
  EditNeedDTO,
  CreateNeedDTO,
  EditNeed,
  EditNeedGroupDTO,
  ICreateNeedGroup,
} from 'src/modules/donationModule/childNeed/childNeed.module.interface';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';
import NeedManagementRouteService from 'src/routes/authorityRoutes/needManagement/needManagement.route.service';

@UseInterceptors(new CookieInterceptor(Role.Authority))
@Controller('authority/needManagement')
export default class NeedManagmentRouteController {
  constructor(
    private childManagementRouteService: NeedManagementRouteService,
  ) {}

  @Get('/getNeedGroup/:childId')
  public async GetNeedGroup(
    @Param('childId', ParseIntPipe) childId: number,
    @User(Role.Authority) authority: IUserCookie,
  ) {
    const data = await this.childManagementRouteService.getChildNeedsData(
      authority,
      childId,
    );

    return { ok: true, message: 'x', data };
  }

  @Post('createNeed/:childId')
  public async CreateNeed(
    @Param('childId', ParseIntPipe) childId: number,
    @User(Role.Authority) authotiy: IUserCookie,
    @Body() requestBody: CreateNeedDTO,
  ) {
    console.log(requestBody);
    const result = await this.childManagementRouteService.createNeeds(
      childId,
      authotiy,
      requestBody,
    );

    return {
      ok: true,
      message: 'The Child Needs hsa been created',
      data: result,
    };
  }

  @Patch('editNeed')
  public async EditNeed(@Body() requestBody: EditNeed) {
    const updatedNeeds =
      await this.childManagementRouteService.editNeed(requestBody);

    return {
      ok: true,
      message: 'Child Needs Succesfully Updated',
      data: updatedNeeds,
    };
  }

  @Delete('deleteNeed/:needId')
  public async DeleteNeed(@Param('needId', ParseIntPipe) childNeedId: number) {
    const deletedNeed =
      await this.childManagementRouteService.deleteNeed(childNeedId);

    return {
      ok: true,
      message: 'The Child Need Succesfully Deleted',
      data: deletedNeed,
    };
  }

  @Post('createNeedGroup')
  public async CreateNeedGroup(@Body() body: ICreateNeedGroup) {
    const created =
      await this.childManagementRouteService.createNeedGroup(body);
  }

  @Post('editNeedGroup')
  public async EditNeedGroup(@Body() body: EditNeedGroupDTO) {
    const editedNeedGrouyp =
      await this.childManagementRouteService.editNeedGroup(body);

    return { ok: true, message: 'x', data: editedNeedGrouyp };
  }
}
