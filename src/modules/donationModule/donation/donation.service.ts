import { Injectable } from '@nestjs/common';
import DonationDAO from 'src/database/donation/donation/donation.DAO';
import { IPaymentHistoryFilters } from 'src/database/donation/donation/donation.types';
import UserDAO from 'src/database/user/user/user.DAO';

@Injectable()
export default class DonationService {
  constructor(
    private donationDAO: DonationDAO,
    private userDAO: UserDAO,
  ) {}

  public async listPaumentHistory(
    filters: IPaymentHistoryFilters,
    page: number,
  ) {
    return await this.donationDAO.getPaymentHistory(filters, page);
  }
}
