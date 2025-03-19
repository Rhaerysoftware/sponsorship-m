import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // ManyToOne,
  BeforeInsert,
  Index,
} from 'typeorm';
import { existsSync } from 'fs';
// import Identification from './identification.entity';
import { IsUrl } from 'class-validator';
import { ServerError } from 'src/utils/error';

@Entity()
export default class UserCredentialDocuments {
  @Index()
  @PrimaryGeneratedColumn()
  credentialId: number;

  @IsUrl()
  @Column('varchar')
  path: string;

  /*@ManyToOne(() => Identification, (identification) => identification.documents)
  identification: Identification;*/

  @BeforeInsert()
  private checkIfPathExist() {
    const isExists = existsSync(this.path);

    if (!isExists) {
      throw new ServerError(
        `The given '${this.path}' path is invalid. Please enter correct file path.`,
      );
    }
  }
}
