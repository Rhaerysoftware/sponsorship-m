import { Injectable } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import { UserNotFoundError } from 'src/utils/error';
import { FindOptionsWhere, Repository } from 'typeorm';
import Admin from 'src/database/user/admin/admin.entity';

@Injectable()
export default class AdminDAO {
  @Injector(Admin) private adminRepository: Repository<Admin>;

  private async saveAdminEntity(entity: Admin) {
    return await this.adminRepository.save(entity);
  }

  public async getAdmin(adminParams: FindOptionsWhere<Admin>) {
    const admin = await this.adminRepository.findOne({
      where: { ...adminParams },
    });

    if (!admin) throw new UserNotFoundError('The Admin Not Found');

    return admin;
  }
}
