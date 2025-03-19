import {
  Controller,
  Get,
  Delete,
  Post,
  Param,
  ParseIntPipe,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { Role } from 'src/database/user';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { IUserCookie } from 'shared/types';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';
import FixNeedManagementRouteService from 'src/routes/authorityRoutes/fixNeedManagement/fixNeedMangement.route.service';
import {
  CreateFixNeedDTO,
  EditFixneedDTO,
  GetFixNeedsDTO,
} from 'src/routes/authorityRoutes/fixNeedManagement/fixNeedManagamenet.interface';
import { EditNeedDTO } from 'src/modules/donationModule/childNeed/childNeed.module.interface';

@UseInterceptors(new CookieInterceptor(Role.Authority))
@Controller('authority/fixNeedManagement')
export default class FixNeedManagementRouteController {
  constructor(
    private fixNeedManagementService: FixNeedManagementRouteService,
  ) {}

  @Post('getFixNeeds/:childId')
  public async GetFixNeedsOfChild(
    @Param('childId', ParseIntPipe) childId: number,
    @User(Role.Authority) authority: IUserCookie,
    @Body() requestBody: GetFixNeedsDTO,
  ) {
    console.log('Fix Needs', 'Vay Vay vaYU');
    const fixNeeds = await this.fixNeedManagementService.getChildFixNeeds(
      childId,
      authority,
      requestBody,
    );

    console.log('Fix Needs', fixNeeds);

    return {
      ok: true,
      message: 'Fix Needs Of Chid Successfully Retrieved',
      data: fixNeeds,
    };
  }

  @Post('createFixNeed/:childId')
  public async CreateFixNeed(
    @Param('childId', ParseIntPipe) childId: number,
    @User(Role.Authority) authority: IUserCookie,
    @Body() requestBody: CreateFixNeedDTO,
  ) {
    const newFixNeed = await this.fixNeedManagementService.createFixNeed(
      authority,
      childId,
      requestBody,
    );

    return {
      ok: true,
      message: 'New Fix Need is Created For Child',
      data: newFixNeed,
    };
  }

  @Post('editFixNeed/:fixNeedId')
  public async EditNeed(
    @Param('fixNeedId', ParseIntPipe) fixNeedId: number,
    @Body() requestBody: EditFixneedDTO,
    @User(Role.Authority) authority: IUserCookie,
  ) {
    const editedNeed = await this.fixNeedManagementService.editFixNeed(
      fixNeedId,
      requestBody,
      authority,
    );

    return { ok: true, message: 'Fix Need is Updated', data: editedNeed };
  }

  @Delete('deleteFixNeed/:fixNeedId')
  public async DeleteFixNeed(
    @Param('fixNeedId', ParseIntPipe) fixNeedId: number,
    @User(Role.Authority) authority: IUserCookie,
  ) {
    const deletedFixNeed = await this.fixNeedManagementService.deleteFixNeed(
      authority,
      fixNeedId,
    );

    return {
      ok: true,
      message: 'The Fix Need is Deleted',
      data: deletedFixNeed,
    };
  }
}
