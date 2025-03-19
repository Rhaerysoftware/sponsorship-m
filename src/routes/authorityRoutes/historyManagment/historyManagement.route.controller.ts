import {
  Body,
  Post,
  Param,
  Controller,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Role } from 'src/database/user';
import { User } from 'src/middlewares/cookie/cookie.decorator';
import { IUserCookie } from 'shared/types';
import {
  HistoryDTO,
  SponsorshipHistoryDTO,
} from 'src/routes/authorityRoutes/historyManagment/historyManagement.route.interface';
import { CookieInterceptor } from 'src/middlewares/cookie/cookie.middleware';
import HistoryManagementRouteService from 'src/routes/authorityRoutes/historyManagment/historyManagement.route.service';

@Controller('authority/historyManagement')
@UseInterceptors(new CookieInterceptor(Role.Authority))
export default class HistoryManagementRouteController {
  constructor(
    private historyManagementRouteService: HistoryManagementRouteService,
  ) {}

  @Post('listHistory/:page')
  public async ListPaymentHistory(
    @Param('page', ParseIntPipe) page: number,
    @Body() requestBody: HistoryDTO,
    @User(Role.Authority) authority: IUserCookie,
  ) {
    const result = await this.historyManagementRouteService.listHistory(
      authority,
      requestBody,
      page,
    );

    return { ok: true, message: 'Payment History Retrieved', data: result };
  }

  @Post('sponsorshipHistory/:page')
  public async ListSponsorshipHistory(
    @Param('page', ParseIntPipe) page: number,
    @User(Role.Authority) authority: IUserCookie,
    @Body() requestBody: SponsorshipHistoryDTO,
  ) {
    const result =
      await this.historyManagementRouteService.getSponsorshipHistory(
        authority,
        requestBody,
        page,
      );

    return { ok: true, message: 'Sponsorship History Retrieved', data: result };
  }
}
