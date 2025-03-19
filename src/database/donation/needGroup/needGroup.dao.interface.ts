import { DeepPartial } from 'typeorm';
import { INeedWithTotal } from 'src/database/donation/childNeed/childNeed.DAO.interface';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';
import NeedGroup from 'src/database/donation/needGroup/needGroup.entity';
import { CityEnum } from 'src/database/user';
import { NeedUrgency } from 'src/database/donation';

type Override<T1, T2> = Omit<T1, keyof T2> & T2;
export type DeepPartialNeedGroup = DeepPartial<NeedGroup>;

export interface NeedGroupWithNeedsWithTotalDonation extends NeedGroup {
  needs: INeedWithTotal[];
}

export interface IFilterNeedGroup {
  city?: CityEnum;
  urgency?: NeedUrgency;
  amount?: {
    min: number;
    max: number;
  };
}
