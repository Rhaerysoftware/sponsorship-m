import { Injectable } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import { Repository, FindOptionsWhere } from 'typeorm';
import Authority from './authority.entity';
import { NotFound } from 'src/utils/error';

@Injectable()
export default class AuthorityDAO {
  @Injector(Authority)
  private authorityRepository: Repository<Authority>;

  private async saveAuthortiyEntity(entity: Authority) {
    return await this.authorityRepository.save(entity);
  }

  public async getAuthority(data: FindOptionsWhere<Authority>) {
    const authority = await this.authorityRepository
      .findOne({
        where: { ...data },
      })
      .catch((err) => {
        throw err;
      });

    if (!authority) throw new NotFound('The Account Not Found');

    return authority;
  }
}
