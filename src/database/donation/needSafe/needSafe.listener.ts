import NeedSafe from 'src/database/donation/needSafe/needSafe.entity';
import Safe from 'src/database/donation/safe/safe.entity';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export default class NeedSafeListener
  implements EntitySubscriberInterface<NeedSafe>
{
  listenTo() {
    return NeedSafe;
  }

  async afterInsert({ manager, entity }: InsertEvent<NeedSafe>) {
    const safeRepository = manager.getRepository(Safe);

    const child = entity.childNeed.group.child;

    const querry = safeRepository
      .createQueryBuilder('safe')
      .update()
      .set({ totalMoney: () => 'totalMoney + 1' })
      .where('safe.child = :userId', { userId: child.userId });

    await querry.execute();
  }
}
