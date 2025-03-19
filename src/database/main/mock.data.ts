import { DataSource, DeepPartial } from 'typeorm';
import { faker } from '@faker-js/faker';
import { ActorType, CityEnum, NationalityEnum, Role } from 'src/database/user';
import { IOptions, Multiplier } from 'src/database/main/mockData.interface';
import Child from 'src/database/user/child/child.entity';
import {
  EntitiyMapType,
  TypeofEntityMap,
} from 'src/database/main/main.database.interface';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';
import NeedGroup from 'src/database/donation/needGroup/needGroup.entity';
import NeedSafe from 'src/database/donation/needSafe/needSafe.entity';
import FixNeed from 'src/database/sponsor/fixNeed/fixNeed.entity';
import Sponsorship from 'src/database/sponsor/sponsorship/sponsorship.entity';
import UserRequest from 'src/database/user/userRequest/userRequest.entity';
import Safe from 'src/database/donation/safe/safe.entity';
import User from 'src/database/user/user/user.entity';
import BaseUser from 'src/database/user/baseUser';
import Authority from 'src/database/user/authority/authority.entity';
import Identification from 'src/database/user/identification/identification.entity';
import { FixNeedStatus, SponsorshipStatus } from 'src/database/sponsor';
import { NeedUrgency, NeedStatus } from 'src/database/donation';
import jwt from 'jsonwebtoken';
import Donation from 'src/database/donation/donation/donation.entity';
import Message from 'src/database/sponsor/message/message.entity';
import SponsorshipPayment from 'src/database/sponsor/sponsorshipPayment/sponsorshipPayment.entity';

enum m {
  Child = 'Child',
  User = 'User',
}

interface IMockDataGenerator {
  multiplier: Multiplier;
}

type DeepPartialChildNeed = DeepPartial<ChildNeed>;

function cryptor(
  value: string,
  mode: 'encrypt' | 'decrypt' = 'encrypt',
): string {
  const secretKey = process.env['JWT_PRIVATE_KEY'];

  if (mode === 'encrypt') {
    return jwt.sign(value, secretKey, {
      // expiresIn: 150 * 365 * 24 * 60 * 60 * 1000,
    });
  }

  return jwt.verify(value, secretKey, { ignoreExpiration: true }) as string;
}

console.log(
  cryptor(
    'eyJhbGciOiJIUzI1NiJ9.WHl6eXQuMTIzNDU.hiz8Vj_fFsaj3oYU_AYEKMQfT24HEAmnmd7l5JeB9i0',
    'decrypt',
  ),
);

export default class MockDataGenerator implements IMockDataGenerator {
  EntityObject: EntitiyMapType<keyof TypeofEntityMap>;
  constructor(private dataSource: DataSource) {
    if (!dataSource) throw new Error('bABA Hata');

    this.EntityObject = {
      Child: this.generateMockChild,
      User: this.generateMockUser,
      ChildNeed: this.generateChildNeed,
      FixNeed: this.generateFixNeed,
      Sponsorship: this.generateSponsorship,
      NeedGroup: function (): NeedGroup {
        throw new Error('Function not implemented.');
      },
      NeedSafe: function (): NeedSafe {
        throw new Error('Function not implemented.');
      },
      Safe: function (): Safe {
        throw new Error('Function not implemented.');
      },
      Authority: function ():
        | ChildNeed
        | NeedGroup
        | NeedSafe
        | FixNeed
        | Sponsorship
        | Authority
        | BaseUser
        | Child
        | User
        | UserRequest {
        throw new Error('Function not implemented.');
      },
      BaseUser: function ():
        | ChildNeed
        | NeedGroup
        | NeedSafe
        | FixNeed
        | Sponsorship
        | Authority
        | BaseUser
        | Child
        | User
        | UserRequest {
        throw new Error('Function not implemented.');
      },
      UserRequest: function ():
        | ChildNeed
        | NeedGroup
        | NeedSafe
        | FixNeed
        | Sponsorship
        | Authority
        | BaseUser
        | Child
        | User
        | UserRequest {
        throw new Error('Function not implemented.');
      },
      Identification: this.generateMockIdentification,
      Message: this.generateMockMessage,
    };
  }

  private countChecker(count: number) {
    if (count <= 0) throw new Error('Thats the wrong Number');

    return count;
  }

  public generator<T extends keyof TypeofEntityMap>(
    count: number,
    Entity: T,
    ...params: Parameters<EntitiyMapType<T>[T]>
  ): Array<TypeofEntityMap[T]> {
    this.countChecker(count);
    const method = this.EntityObject[Entity].bind(this);
    const multiplied = this.multiplier(() => method(...params), { count });

    return multiplied as unknown as TypeofEntityMap[T][];
  }

  public multiplier<Entity>(
    method: (...args: any[]) => Entity,
    options: IOptions,
    param?: any,
  ): Entity[] {
    return faker.helpers.multiple((...param: any[]) => method(param), options);
  }

  public generateMockSafe(child: Child) {
    return this.dataSource.manager.create(Safe, { child });
  }

  public generateMockChild(childParams: DeepPartial<Child> = {}): Child {
    const child = this.dataSource.manager.create(Child, {
      ...this.generateMockBaseUser(),
      role: Role.Child,
      story: faker.person.bio(),
      dateOfBirth: new Date(2010, 1, 1),
      ...childParams,
    });

    return child;
  }

  public generateMockBaseUser(): Partial<BaseUser> {
    return {
      isDeleted: false,
      city: CityEnum.LEFKOŞA,
      email: faker.internet.email(),
      name: faker.person.firstName(),
      lastname: faker.person.lastName(),
      password: cryptor('Xyzyt.12345', 'encrypt'),
      // city: faker.helpers.enumValue(CityEnum),
    };
  }

  public generateMockUser(userParams?: DeepPartial<User>): User {
    const mockBaseUser = this.generateMockBaseUser();

    return this.dataSource.manager.create(User, {
      ...mockBaseUser,
      role: Role.User,
      canLogin: true,
      dateOfBirth: faker.date.birthdate(),
      ...userParams,
    });
  }

  public generateMockAuthority(): Authority {
    return this.dataSource.manager.create(Authority, {
      isDeleted: false,
      city: CityEnum.LEFKOŞA,
      email: 'authority@gmai.com',
      name: 'Samet',
      lastname: 'Sarıçiçek',
      password:
        'eyJhbGciOiJIUzI1NiJ9.WHl6dC4xMjM0NQ.I2cod3KNT9DSb4lZ7z-9aQmhv4SeNANJ1aje401lZKA',
      dateOfBirth: new Date(2001, 1, 15),
    });
  }

  public generateMockIdentification(
    identificationParams: DeepPartial<Identification> = {},
  ): Identification {
    return this.dataSource.manager.create(Identification, {
      nationality: NationalityEnum.KKTC,
      idNumber: faker.string.numeric({ length: 10 }),
      frontPath: 'C:/Users/myfor/sponsorship/src/shared/ID_FRONT_PAGE.jpg',
      backPath: 'C:/Users/myfor/sponsorship/src/shared/ID_BACK_PAGE.jpg',
      ...identificationParams,
    }) as Identification;
  }

  public generateChildNeed(
    childNeedParams: DeepPartial<ChildNeed> = {},
  ): ChildNeed {
    return this.dataSource.manager.create(ChildNeed, {
      amount: 1,
      title: faker.person.zodiacSign(),
      price: 100,
      isDeleted: false,
      ...childNeedParams,
    });
  }

  public generateNeedGroup(needGroupParams: DeepPartial<NeedGroup>): NeedGroup {
    return this.dataSource.manager.create(NeedGroup, {
      explanation: faker.person.jobDescriptor(),
      title: faker.person.jobArea(),
      ...needGroupParams,
    }) as NeedGroup;
  }

  public generateFixNeed({
    child,
    ...rest
  }: DeepPartial<FixNeed> = {}): FixNeed {
    const childInstance = child as Child;
    return this.dataSource.manager.create(FixNeed, {
      ...rest,
      title: faker.commerce.productName(),
      explanation: faker.commerce.productDescription(),
      amount: faker.number.int({ min: 50, max: 200 }),
      status: FixNeedStatus.ACTIVE,
      isDeleted: false,
      child: childInstance,
    });
  }

  public genreateChildNeed(
    childNeedParams: DeepPartial<ChildNeed>,
  ): DeepPartialChildNeed {
    const amount = faker.number.int({ min: 50, max: 100 });
    return this.dataSource.manager.create(ChildNeed, {
      amount,
      isDeleted: false,
      price: 100,
      // price: faker.number.float({ min: 50, max: 75, precision: 2 }),
      startAmount: amount,
      status: NeedStatus.ACTIVE,
      title: faker.commerce.product(),
      urgency: NeedUrgency.NORMAL,
      ...childNeedParams,
    });
  }

  public generateSponsorship({
    fixNeed,
    user,
    ...rest
  }: DeepPartial<Sponsorship>): Sponsorship {
    const fixNeedInstance = fixNeed as FixNeed;
    const userInstance = user as User;

    return this.dataSource.manager.create(Sponsorship, {
      fixNeed: fixNeedInstance,
      user: userInstance,
      status: SponsorshipStatus.APPROVED,
    });
  }

  public generateIdentification(
    identificationParams: DeepPartial<Identification>,
  ): Identification {
    return this.dataSource.manager.create(Identification, {
      nationality: NationalityEnum.KKTC,
      idNumber: faker.string.numeric({ length: 10 }),
      frontPath: 'C:/Users/myfor/sponsorship/src/shared/ID_FRONT_PAGE.jpg',
      backPath: 'C:/Users/myfor/sponsorship/src/shared/ID_BACK_PAGE.jpg',
      ...identificationParams,
    }) as Identification;
  }

  public generateMockDonation(donationParams: DeepPartial<Donation>): Donation {
    return this.dataSource.manager.create(Donation, {
      ...donationParams,
    }) as Donation;
  }

  public generateMockMessage({ sponsorship }: DeepPartial<Message>): Message {
    const from = Math.random() > 0.5 ? Role.Child : Role.User;
    const to = from === Role.Child ? Role.User : Role.Child;

    return this.dataSource.manager.create(Message, {
      from,
      to,
      message: faker.animal.bird(),
      sponsorship,
    });
  }

  public generateMockSponsorshipPayment(sponsorship: Sponsorship) {
    return this.dataSource.manager.create(SponsorshipPayment, {
      sponsorship,
      paymentAmount: sponsorship.fixNeed.amount,
    });
  }

  public genearateMockUserRequest(
    userRequestParams: DeepPartial<UserRequest>,
  ): UserRequest {
    return this.dataSource.manager.create(UserRequest, {
      ...userRequestParams,
    }) as UserRequest;
  }
}
