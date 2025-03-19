import { Module } from '@nestjs/common';
import MessageEntityModule from 'src/database/sponsor/message/messageEntity.module';
import CategoryEntityModule from 'src/database/donation/category/category.module';
import ChildNeedEntityModule from 'src/database/donation/childNeed/childNeedEntity.module';
import DonationEntityModule from 'src/database/donation/donation/donationEntityModule.module';
import NeedGroupEntityModule from 'src/database/donation/needGroup/needGroupEntity.module';
import NeedSafeEntityModule from 'src/database/donation/needSafe/needSafeEntity.module';
import SafeEntityModule from 'src/database/donation/safe/safeEntity.module';
import MySQLConnectorModule from 'src/database/main/mysql.connector.module';
import FixNeedEntityModule from 'src/database/sponsor/fixNeed/fixNeedEntity.module';
import SponsorshipEntityModule from 'src/database/sponsor/sponsorship/sponsorshipEntity.module';
import SponsorshipPaymentEntityModule from 'src/database/sponsor/sponsorshipPayment/sponsorshipPaymentEntity.module';
import AdminEntityModule from 'src/database/user/admin/adminEntity.module';
import AnswerEntityModule from 'src/database/user/answer/answerEntity.module';
import AuthorityEntityModule from 'src/database/user/authority/authority.module';
import ChildEntityModule from 'src/database/user/child/child.module';
import ChildStatusEntityModule from 'src/database/user/childStatus/childStatusEntityModule.module';
import IdentificationEntityModule from 'src/database/user/identification/identification.module';
import QuestionEntityModule from 'src/database/user/question/questionEntity.module';
import UserEntityModule from 'src/database/user/user/userEntity.module';
import UserRequestEntityModule from 'src/database/user/userRequest/userRequestEntity.module';

const AllModules = [
  SafeEntityModule,
  MySQLConnectorModule,
  UserEntityModule,
  ChildEntityModule,
  AuthorityEntityModule,
  NeedGroupEntityModule,
  ChildNeedEntityModule,
  UserRequestEntityModule,
  SponsorshipEntityModule,
  CategoryEntityModule,
  DonationEntityModule,
  NeedSafeEntityModule,
  FixNeedEntityModule,
  SponsorshipPaymentEntityModule,
  AdminEntityModule,
  AnswerEntityModule,
  ChildStatusEntityModule,
  IdentificationEntityModule,
  QuestionEntityModule,
  MessageEntityModule,
];

@Module({
  imports: AllModules,
  exports: AllModules,
})
export default class DatabaseModule {}
