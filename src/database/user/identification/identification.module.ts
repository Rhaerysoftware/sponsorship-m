import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import DatabaseModule from 'src/database/main/mysql.connector.module';
import Identification from 'src/database/user/identification/identification.entity';
import IdentificationDAO from 'src/database/user/identification/identification.DAO';

const IdentificationProvider = createRepositoryProvider(Identification);

@Module({
  imports: [forwardRef(() => DatabaseModule) /*DatabaseModule*/],
  providers: [IdentificationProvider, IdentificationDAO],
  exports: [IdentificationDAO],
})
export default class IdentificationEntityModule {}
