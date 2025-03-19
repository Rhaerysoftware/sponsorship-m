import { DeepPartial, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Injector } from 'src/database/utils/repositoryProvider';
import Category from 'src/database/donation/category/category.entity';

@Injectable()
export default class CategoryDAO {
  @Injector(Category) private categoryRepository: Repository<Category>;

  private async saveCategoryEntity(entity: Category) {
    return await this.categoryRepository.save(entity);
  }

  public async createCategory(params: DeepPartial<Category>) {
    const categoryInstance = this.categoryRepository.create(params);

    return await this.saveCategoryEntity(categoryInstance);
  }

  public async getCategories() {
    const categories = await this.categoryRepository.find();
    return categories;
  }
}
