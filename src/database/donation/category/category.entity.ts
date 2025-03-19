import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  Index,
} from 'typeorm';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';

@Entity()
export default class Category {
  @Index()
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column('varchar')
  categoryName: string;

  // @OneToMany(() => ChildNeed, (childNeed) => childNeed.category)
  // needs: ChildNeed[];

  @BeforeInsert()
  private fixUppercase() {
    this.categoryName = this.categoryName
      .split(' ')
      .map((word) => word[0].toLocaleUpperCase('tr-TR') + word.substring(1))
      .join(' ');
  }

  //private iconPath: string;
}
