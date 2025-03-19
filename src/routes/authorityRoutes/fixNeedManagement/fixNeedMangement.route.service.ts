import { Injectable } from '@nestjs/common';
import { IUserCookie } from 'shared/types';
import {
  CreateFixNeedDTO,
  EditFixneedDTO,
  GetFixNeedsDTO,
} from 'src/routes/authorityRoutes/fixNeedManagement/fixNeedManagamenet.interface';
import FixNeedService from 'src/modules/sponsorModule/fixNeed/fixNeed.service';

@Injectable()
export default class FixNeedManagementRouteService {
  constructor(private fixNeedService: FixNeedService) {}

  public async deleteFixNeed(authority: IUserCookie, fixNeedId: number) {
    return await this.fixNeedService.disableFixNeed(fixNeedId);
  }

  public async editFixNeed(
    fixNeedId: number,
    requestBody: EditFixneedDTO,
    authority: IUserCookie,
  ) {
    return await this.fixNeedService.updateFixNeed(fixNeedId, {
      ...requestBody,
    });
  }

  public async getChildFixNeeds(
    childId: number,
    authority: IUserCookie,
    body: GetFixNeedsDTO,
  ) {
    return await this.fixNeedService.gtFixNeedsOfChild(childId, body);
  }

  public async createFixNeed(
    authority: IUserCookie,
    childId: number,
    body: CreateFixNeedDTO,
  ) {
    const createdFixNeed = await this.fixNeedService.createFixNeed(
      body,
      childId,
    );

    return createdFixNeed;
  }
}
