import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import { Repository, DeepPartial } from 'typeorm';
import { NotFound, UserNotFoundError } from 'src/utils/error';
import { Role } from 'src/database/user';
import {
  ChildWhere,
  DeepPartialChild,
} from 'src/database/user/child/child.DAO.interface';
import {
  IFilterChilds,
  ISortChilds,
} from 'src/modules/userModule/childModule/child.module.interface';
import { IPaginationData } from 'shared/types';
import Child from 'src/database/user/child/child.entity';
import NeedGroupDAO from 'src/database/donation/needGroup/needGroup.DAO';

interface IChildSafe {
  totalNeedsDonation: number;
  totalNeedsPrice: number;
  moneyBox: number;
}

@Injectable()
export default class ChildDAO {
  constructor(
    @Injector(Child) public childRepository: Repository<Child>,
    @Inject(forwardRef(() => NeedGroupDAO)) private needGroupDAO: NeedGroupDAO,
  ) {}

  public async updateChildEntity(
    entity: Child,
    updatedChildData: DeepPartial<Child>,
  ) {
    if (!entity.userId) throw Error('Entity id is not provided');

    return (await this.childRepository.save({
      ...entity,
      ...updatedChildData,
      userId: entity.userId,
    })) as Child;
  }

  public async saveChildEntity(entity: Child) {
    return await this.childRepository.save(entity);
  }

  public async getChild(childAttributes: ChildWhere) {
    const child = await this.childRepository.findOne({
      where: { ...childAttributes },
      relations: {
        safe: true,
        identifications: true,
        fixNeeds: true,
        needGroups: {
          needs: true,
        },
      },
    });

    if (!child) throw new NotFound('Child is not Found');

    return child;
  }

  public async createChild(childData: DeepPartialChild) {
    const createdChild = this.childRepository.create({
      ...childData,
      role: Role.Child,
    });
    return await this.saveChildEntity(createdChild);
  }

  public async deleteChild(userId: number) {
    const child = await this.getChild({ userId });

    if (!child) throw new UserNotFoundError('The Child is Not Found');

    child.isDeleted = true;

    return await this.saveChildEntity(child);
  }

  public async updateChild(userId: number, body: DeepPartialChild) {
    const child = await this.getChild({ userId });

    if (!child) throw new UserNotFoundError('The Child is Not Found');

    return await this.updateChildEntity(child, body);
  }

  public async listChilds(
    { age, idNumber, lastname, name }: IFilterChilds = {},
    sort: ISortChilds = {},
    page: number = 0,
  ): Promise<IPaginationData<Child>> {
    let querry = this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.identifications', 'identification')
      .where('child.isDeleted = :isDeleted', { isDeleted: false })
      .offset(page * 10)
      .limit(10);

    if (name) {
      querry = querry.andWhere('name like :name', {
        name: '%' + name + '%',
      });
    }

    if (lastname) {
      querry = querry.andWhere('child.lastname like :lastname', {
        lastname: '%' + lastname + '%',
      });
    }

    // if (age) {
    //   querry = querry.andWhere('age = :age', { age });
    // }

    if (idNumber) {
      querry = querry = querry.andWhere('idNumber like :idNumber', {
        idNumber,
      });
    }

    if (sort.sortBy) {
      querry = querry.orderBy(sort.sortBy, sort.way || 'ASC');
    }

    const [count, result] = await Promise.all([
      querry.getCount(),
      querry.getMany(),
    ]);

    return { count, result };
  }

  public async getChildCard(childId: number) {
    const child = await this.getChild({ userId: childId });

    const activeGroup = await this.needGroupDAO
      .getActiveNeedGroupWithNeeds(child.userId)
      .catch((error) => error.status === 405 && null);

    if (activeGroup) {
      child.needGroups = [activeGroup];
    }

    return child;
  }

  public async getChildsOfSponosredUser(userId: number) {
    const query = this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.fixNeeds', 'fix_need')
      .leftJoinAndSelect('fix_need.sponsorship', 'sponsorship')
      .where('sponsorship.user = :userId', { userId });

    const childs = await query.getMany();

    if (childs.length === 0) return null;

    return childs;
  }

  public async calculateChildSafeMoney(childId: number) {
    const child = await this.getChild({ userId: childId });

    const safeQuery = this.childRepository
      .createQueryBuilder('child')
      .leftJoinAndSelect('child.needGroups', 'need_group')
      .leftJoinAndSelect('need_group.needs', 'child_need')
      .leftJoinAndSelect('child_need.donations', 'donation')
      .where('child.userId = :childId', { childId });

    const selected = safeQuery.select([
      'SUM(IFNULL(donation.amount,0)) AS totalNeedsDonation',
      'SUM(IFNULL(child_need.amount * child_need.price,0)) AS totalNeedsPrice',
    ]);

    const { totalNeedsDonation, totalNeedsPrice } =
      (await selected.getRawOne()) as Omit<IChildSafe, 'moneyBox'>;

    console.log(
      'TOTLA:',
      totalNeedsDonation,
      totalNeedsPrice,
      selected.getQuery(),
    );

    const difference = totalNeedsDonation - totalNeedsPrice;

    const moneyBox = difference < 0 ? 0 : difference;

    const result = {
      totalNeedsDonation,
      totalNeedsPrice: parseInt(totalNeedsPrice.toString()),
      moneyBox,
    } as IChildSafe;

    return result;
  }
}
