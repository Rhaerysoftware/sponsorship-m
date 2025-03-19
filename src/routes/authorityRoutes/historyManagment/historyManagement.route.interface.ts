import { IsNotEmpty, IsOptional } from 'class-validator';

type HistoryType = 'Donation' | 'Sponsorship';

class BaseHistory {
  @IsOptional()
  userId?: number;

  @IsOptional()
  childId?: number;

  @IsOptional()
  dateRange?: [Date, Date];
}

export class HistoryDTO extends BaseHistory {
  @IsNotEmpty()
  type: HistoryType;
}

export class SponsorshipHistoryDTO extends BaseHistory {}
