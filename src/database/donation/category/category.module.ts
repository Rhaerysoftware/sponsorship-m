import { Module, forwardRef } from '@nestjs/common';
import { createRepositoryProvider } from 'src/database/utils/repositoryProvider';
import CategoryDAO from 'src/database/donation/category/category.DAO';
import Category from 'src/database/donation/category/category.entity';
import DatabaseModule from 'src/database/main/database.module';

const CategoryProvider = createRepositoryProvider(Category);

@Module({
  imports: [forwardRef(() => DatabaseModule)],
  providers: [CategoryProvider, CategoryDAO],
  exports: [CategoryDAO],
})
export default class CategoryEntityModule {}
