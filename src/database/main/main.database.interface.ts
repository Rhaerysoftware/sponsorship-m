import { type Entity, EntityTarget, DeepPartial } from 'typeorm';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';
import NeedGroup from 'src/database/donation/needGroup/needGroup.entity';
import NeedSafe from 'src/database/donation/needSafe/needSafe.entity';
import Safe from 'src/database/donation/safe/safe.entity';
import FixNeed from 'src/database/sponsor/fixNeed/fixNeed.entity';
import Sponsorship from 'src/database/sponsor/sponsorship/sponsorship.entity';
import Authority from 'src/database/user/authority/authority.entity';
import BaseUser from 'src/database/user/baseUser';
import Child from 'src/database/user/child/child.entity';
import User from 'src/database/user/user/user.entity';
import UserRequest from 'src/database/user/userRequest/userRequest.entity';
import Identification from 'src/database/user/identification/identification.entity';
import Message from 'src/database/sponsor/message/message.entity';

interface EntyityRecord {
  ChildNeed: ChildNeed;
  NeedGroup: NeedGroup;
  NeedSafe: NeedSafe;
  Safe: Safe;
  FixNeed: FixNeed;
  Sponsorship: Sponsorship;
  Authority: Authority;
  BaseUser: BaseUser;
  Child: Child;
  User: User;
  UserRequest: UserRequest;
  Identification: Identification;
  Message: Message;
}

type Entities<T> = T extends 'ChildNeed'
  ? ChildNeed
  : T extends 'NeedGroup'
  ? NeedGroup
  : T extends 'NeedSafe'
  ? NeedSafe
  : T extends 'FixNeed'
  ? FixNeed
  : T extends 'Sponsorship'
  ? Sponsorship
  : T extends 'Authority'
  ? Authority
  : T extends 'BaseUser'
  ? BaseUser
  : T extends 'Child'
  ? Child
  : T extends 'User'
  ? User
  : T extends 'UserRequest'
  ? UserRequest
  : T extends 'Safe'
  ? Safe
  : T extends Identification
  ? Identification
  : Message;

const EntityMap = {
  ChildNeed: ChildNeed,
  NeedGroup: NeedGroup,
  NeedSafe: NeedSafe,
  Safe: Safe,
  FixNeed: FixNeed,
  Sponsorship: Sponsorship,
  Authority: Authority,
  BaseUser: BaseUser,
  Child: Child,
  User: User,
  UserRequest: UserRequest,
  Identification: Identification,
};
export type TypeofEntityMap = EntyityRecord;
export type EntitiyMapType<T extends keyof Partial<EntyityRecord>> = Record<
  T,
  (...entityParams: DeepPartial<Entities<T>>[]) => DeepPartial<Entities<T>>
>;
