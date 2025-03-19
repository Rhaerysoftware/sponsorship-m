import { Injectable } from '@nestjs/common';
import { NeedSafeType } from 'src/database/donation';
import NeedSafeDAO from 'src/database/donation/needSafe/needSafe.DAO';
import SafeDAO from 'src/database/donation/safe/safe.DAO';

@Injectable()
export default class SafeService {
  private needSafeDAO: NeedSafeDAO;
  private childSafeDAO: SafeDAO;

  public async depositMoneyToChild(
    needId: number,
    childId: number,
    money: number,
  ) {
    const needSafeRecord = await this.needSafeDAO.createRecordForNeedSafe(
      {
        amount: money,
        childNeed: { needId },
      },
      NeedSafeType.INCOME,
    );

    const totalMoney = await this.needSafeDAO.getTotalOfNeedSafe(
      NeedSafeType.INCOME,
      { childNeed: { needId } },
    );

    await this.childSafeDAO.setTotalMoney(totalMoney, childId);

    return needSafeRecord;
  }
}
