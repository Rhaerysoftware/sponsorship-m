import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import Donation from 'src/database/donation/donation/donation.entity';
import DonationDAO from 'src/database/donation/donation/donation.DAO';
import DatabaseModule from 'src/database/main/database.module';

const DonationProvider = createRepositoryProvider(Donation);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [DonationProvider, DonationDAO],
  exports: [DonationDAO],
})
export default class DonationEntityModule {}
