import { SponsorshipStatus } from 'src/database/sponsor';

export interface IGetFixNeedFilter {
  status: 'ALL' | 'Active' | 'Inactive' | SponsorshipStatus.WAITING_FOR_PAYMENT;
}
