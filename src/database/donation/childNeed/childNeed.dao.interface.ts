import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';

export interface INeedWithTotal extends ChildNeed {
  totalDonation: number;
}

export interface IDonateNeed {
  needId: number;
  amount: number;
}
