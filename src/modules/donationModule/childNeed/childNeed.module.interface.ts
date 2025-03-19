import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import {
  NeedUrgency,
  NeedStatus,
  ChildNeedGroupStatus,
} from 'src/database/donation';
import { CityEnum } from 'src/database/user';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';
import { NeedGroup } from 'src/database/main/entities';

class Need implements Partial<ChildNeed> {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  amount: number;

  // @IsNotEmpty()
  // urgency: NeedUrgency;
}

export class CreateNeedDTO {
  @IsNotEmpty()
  needs: Need[];

  // @IsNotEmpty()
  // title: string;
}

export class ICreateNeedGroup {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  explanation: string;

  @IsNotEmpty()
  userId: number;
}

export class EditNeedGroupDTO implements Partial<NeedGroup> {
  @IsNotEmpty()
  needGroupId: number;

  @IsOptional()
  title?: string;
  @IsOptional()
  status?: ChildNeedGroupStatus;
  @IsOptional()
  explanation?: string;
}

export class EditNeed implements Partial<ChildNeed> {
  @IsNotEmpty()
  needId: number;

  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @Min(0)
  price?: number;

  @IsOptional()
  @Min(0)
  amount?: number;

  @IsOptional()
  status?: NeedStatus;
}

export class EditNeedDTO {
  @IsOptional()
  editedNeeds: EditNeed[];
}

export class ListChildWithNeeds {
  city?: CityEnum;
  urgency?: NeedUrgency;
  age?: [number, number];
}

export class DonateToNeed {
  needId: number;
  cost: number;
}

export class DonateToChild {
  childId: number;
  needs: DonateToNeed[];
}

export class DonationHistoryParams {
  dateRange?: [Date, Date];
}
