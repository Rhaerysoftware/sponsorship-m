import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository, FindOptionsWhere } from 'typeorm';
import { Injector } from 'src/database/utils/repositoryProvider';
import { NeedSafeType } from 'src/database/donation';
import { NotFound } from 'src/utils/error';
import NeedSafe from 'src/database/donation/needSafe/needSafe.entity';

interface INeedSafeTotal {
  total: number;
}

@Injectable()
export default class NeedSafeDAO {
  @Injector(NeedSafe) private needSafeRepository: Repository<NeedSafe>;

  private async saveNeedSafeEntity(entity: NeedSafe) {
    return await this.needSafeRepository.save(entity);
  }

  public async createRecordForNeedSafe(
    params: DeepPartial<NeedSafe>,
    type: NeedSafeType,
  ) {
    const needSafeInstance = this.needSafeRepository.create({
      ...params,
      type,
    });

    return await this.saveNeedSafeEntity(needSafeInstance);
  }

  public async getTotalOfNeedSafe(
    type: NeedSafeType,
    safeParams: FindOptionsWhere<NeedSafe>,
  ): Promise<number> {
    const total = (await this.needSafeRepository
      .createQueryBuilder('need_safe')
      .select('CAST(SUM(need_safe.amount) as total AS UNSIGNED) as total ')
      .where({ ...safeParams })
      .getRawOne()) as INeedSafeTotal;

    if (!total) throw new NotFound('Safe was Not Found');

    return total.total;
  }
}
