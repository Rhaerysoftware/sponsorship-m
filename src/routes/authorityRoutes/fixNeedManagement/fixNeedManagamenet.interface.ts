import { IsNotEmpty, IsOptional } from 'class-validator';
import { FixNeedStatus, SponsorshipStatus } from 'src/database/sponsor';
import { IGetFixNeedFilter } from 'src/database/sponsor/fixNeed/fixNeed.interface';

export class GetFixNeedsDTO implements IGetFixNeedFilter {
  @IsNotEmpty({ message: 'Please Provide Some Filter' })
  status: 'ALL' | 'Active' | 'Inactive' | SponsorshipStatus.WAITING_FOR_PAYMENT;
}

export class CreateFixNeedDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  amount: number;
}

export class EditFixneedDTO {
  @IsOptional()
  title?: string;

  @IsOptional()
  amount?: number;
}
