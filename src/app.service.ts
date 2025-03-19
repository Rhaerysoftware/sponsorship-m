import { Injectable } from '@nestjs/common';
import CategoryDAO from 'src/database/donation/category/category.DAO';
import ChildNeedDAO from 'src/database/donation/childNeed/childNeed.DAO';
import DonationDAO from 'src/database/donation/donation/donation.DAO';
import NeedGroupDAO from 'src/database/donation/needGroup/needGroup.DAO';
import NeedSafeDAO from 'src/database/donation/needSafe/needSafe.DAO';
import SafeDAO from 'src/database/donation/safe/safe.DAO';
import FixNeedDAO from 'src/database/sponsor/fixNeed/fixNeed.DAO';
import SponsorshipDAO from 'src/database/sponsor/sponsorship/sponsorship.dao';
import AdminDAO from 'src/database/user/admin/admin.DAO';
import AnswerDAO from 'src/database/user/answer/answer.DAO';
import AuthorityDAO from 'src/database/user/authority/authority.DAO';
import ChildDAO from 'src/database/user/child/child.DAO';
import ChildStatusDAO from 'src/database/user/childStatus/childStatus.DAO';
import IdentificationDAO from 'src/database/user/identification/identification.DAO';
import QuestionDAO from 'src/database/user/question/question.DAO';
import UserDAO from 'src/database/user/user/user.DAO';
import UserRequestDAO from 'src/database/user/userRequest/userRequest.DAO';

@Injectable()
export class AppService {
  constructor(
    // private sponsorshipPaymentDAO: SponsorshipPaymentDAO,
    private userRequestDAO: UserRequestDAO,
    private userDAO: UserDAO,
    private childDAO: ChildDAO,
    private authorityDAO: AuthorityDAO,
    private needGroupDAO: NeedGroupDAO,
    private childNeedDAO: ChildNeedDAO,
    private sponsorshipDAO: SponsorshipDAO,
    private categoryDAO: CategoryDAO,
    private donationDAO: DonationDAO,
    private needSafeDAO: NeedSafeDAO,
    private safeDAO: SafeDAO,
    private fixNeedDAO: FixNeedDAO,
    private adminDAO: AdminDAO,
    private answerDAO: AnswerDAO,
    private childStatusDAO: ChildStatusDAO,
    private identificationDAO: IdentificationDAO,
    private questionDAO: QuestionDAO,
  ) {}
  async getHello() {
    return await this.sponsorshipDAO.getSponsorship({ sponsorshipId: 1 });
  }
}
