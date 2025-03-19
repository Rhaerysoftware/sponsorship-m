import { Injectable } from '@nestjs/common';
import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { Injector } from 'src/database/utils/repositoryProvider';
import { NotFound, ServerError } from 'src/utils/error';
import Safe from 'src/database/donation/safe/safe.entity';
import ChildDAO from 'src/database/user/child/child.DAO';

@Injectable()
export default class SafeDAO {
  constructor(
    @Injector(Safe) private safeRepository: Repository<Safe>,
    private childDAO: ChildDAO,
  ) {}

  private async saveSafeEntity(entity: Safe) {
    return await this.safeRepository.save(entity);
  }

  public async createChildSafe(childParams: DeepPartial<Safe>) {
    const safeInstance = this.safeRepository.create(childParams);

    return await this.saveSafeEntity(safeInstance);
  }

  public async getChildSafe(safeParams: FindOptionsWhere<Safe>) {
    const safe = await this.safeRepository.findOne({
      where: { ...safeParams },
    });

    if (!safe) throw new NotFound();

    return safe;
  }

  public async setTotalMoney(money: number, childId: number) {
    if (money < 0)
      throw new Error(
        'Bro The Total Money Cannopt be Negative. Are you out of ypur Minfd',
      );

    const safe = await this.getChildSafe({ child: { userId: childId } });

    safe.totalMoney = money;

    return await this.saveSafeEntity(safe);
  }

  public async addMoneyToChildSafe(childId: number, money: number) {
    const child = await this.childDAO.getChild({ userId: childId });

    const childSafe = await this.getChildSafe({ child });

    if (money < 0) throw new ServerError('Money Cannot be lower t han 0');

    childSafe.totalMoney = childSafe.totalMoney + money;

    return await this.saveSafeEntity(childSafe);
  }
}
