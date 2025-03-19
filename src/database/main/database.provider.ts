import { GlobalConfigService } from 'src/services/config/config.service';
import { DataSource } from 'typeorm';
import { SponsorshipStatus } from 'src/database/sponsor';
import MockDataGenerator from 'src/database/main/mock.data';
import NeedGroup from 'src/database/donation/needGroup/needGroup.entity';
import Sponsorship from 'src/database/sponsor/sponsorship/sponsorship.entity';
import Identification from 'src/database/user/identification/identification.entity';
import ChildNeed from 'src/database/donation/childNeed/childNeed.entity';
import Donation from 'src/database/donation/donation/donation.entity';
import FileService from 'src/services/file/file.service';
import { readFileSync } from 'fs';
import Safe from 'src/database/donation/safe/safe.entity';
import { ActorType } from 'src/database/user';

const fronIdBuffer = readFileSync(
  'C:/Users/myfor/OneDrive/Masaüstü/ID_FRONT_PAGE.jpg',
);
const backIdBuffer = readFileSync(
  'C:/Users/myfor/OneDrive/Masaüstü/ID_BACK_PAGE.jpg',
);

// InitializedDatabase.entityMetadatas.map((metada) => metada.tableName);

const mainUser = {
  name: 'Bruce',
  lastname: 'Wayne',
  email: 'Xyz@gmail.com',
};

export const databaseProviders = [
  {
    provide: 'SPONSORSHIP',
    useFactory: async (
      configService: GlobalConfigService,
      fileService: FileService,
    ) => {
      const isDevMode = configService.getDevMode();
      const databaseOptions = configService.getDatabaseConfig();

      const Database = new DataSource({
        migrationsRun: false,
        synchronize: true || isDevMode,
        dropSchema: isDevMode,
        ...databaseOptions,
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        subscribers: [__dirname + '/../**/*.listener.{js,ts}'],
      });

      const InitializedDatabase = await Database.initialize();

      const mockDataGenerator = new MockDataGenerator(InitializedDatabase);

      const managerSave = <T>(entity: T): Promise<T> =>
        InitializedDatabase.manager.save(entity);

      const devOps = async () => {
        const [, childs, users] = await Promise.all([
          managerSave(mockDataGenerator.generateMockAuthority()),
          managerSave([
            mockDataGenerator.generateMockChild({
              name: 'new child',
              lastname: 'child',
              email: 'child@gmail.com',
            }),
            ...mockDataGenerator.generator(20, 'Child'),
          ]),
          managerSave([
            mockDataGenerator.generateMockUser(mainUser),
            ...mockDataGenerator.generator(19, 'User'),
          ]),
        ]);

        const needGroups: NeedGroup[] = [];
        const sposnsoships: Sponsorship[] = [];
        const identifications: Identification[] = [];
        const identificationOfUsers: Identification[] = [];
        const safes: Safe[] = [];
        const requestUsers = users.slice(5);

        const userRequests = users.map((user) => {
          const request = mockDataGenerator.genearateMockUserRequest({ user });
          identificationOfUsers.push(
            mockDataGenerator.generateIdentification({
              user,
              actorType: ActorType.USER,
            }),
          );
          fileService.saveFile2(
            fronIdBuffer,
            'identification',
            user,
            'ID_FRONT_PAGE.jpg',
          );
          fileService.saveFile2(
            backIdBuffer,
            'identification',
            user,
            'ID_BACK_PAGE.jpg',
          );
          return request;
        });

        let i = 0;

        for (const child of childs) {
          const user = users[i];

          safes.push(mockDataGenerator.generateMockSafe(child));

          const needGroup = await managerSave(
            mockDataGenerator.generateNeedGroup({ child }),
          );
          const childNeeds = await managerSave(
            mockDataGenerator.generator(5, 'ChildNeed', { group: needGroup }),
          );

          const fixNeeds = await managerSave(
            mockDataGenerator.generator(5, 'FixNeed', { child }),
          );

          const identificationOfChild =
            mockDataGenerator.generateMockIdentification({ child });

          identifications.push(identificationOfChild);

          sposnsoships.push(
            ...fixNeeds.map((fixNeed, i) =>
              mockDataGenerator.generateSponsorship({
                fixNeed,
                user: users[i],
                status: SponsorshipStatus.APPROVED,
              }),
            ),
          );

          child.fixNeeds = [...fixNeeds];
          needGroup.needs = [...childNeeds];
          child.needGroups = [needGroup];

          const newInstnace = InitializedDatabase.manager.create(
            NeedGroup,
            needGroup,
          );
          needGroups.push(newInstnace);
          i++;
        }

        const toDonateChildNeed = childs[0].needGroups[0].needs[0];

        const donations: Donation[] = [];

        for (const user of users) {
          const donation = mockDataGenerator.generateMockDonation({
            amount: 5,
            childNeed: toDonateChildNeed,
            user,
          });
          donations.push(donation);
        }

        const [needGroupsRecords, sponsorshipRecords, ...rest] =
          await Promise.all([
            managerSave(needGroups),
            managerSave(sposnsoships),
            managerSave(identifications),
            managerSave(donations),
            managerSave(userRequests),
            managerSave(safes),
            managerSave(identificationOfUsers),
          ]);

        const fUfC = sponsorshipRecords[0];

        const mockMessages = await managerSave(
          mockDataGenerator.generator(100, 'Message', { sponsorship: fUfC }),
        );

        fUfC.messages = mockMessages;

        const childNeedRepository =
          InitializedDatabase.getRepository(ChildNeed);
        /*
        let need = await childNeedRepository.findOne({ where: { needId: 1 } });
        console.log('Need:', need);*/

        // const sChild = await managerSave(
        //   mockDataGenerator.generateMockChild({
        //     name: 'new child',
        //     lastname: 'child',
        //     email: 'child@gmail.com',
        //   }),
        // );

        const sChild = childs[0];

        /*const sChildSafe = await managerSave(
          mockDataGenerator.generateMockSafe(sChild),
        );
*/
        const sChildNeedGroup = await managerSave(
          mockDataGenerator.generateNeedGroup({ child: sChild }),
        );

        const sChildNeeds = await managerSave(
          mockDataGenerator.generator(3, 'ChildNeed', {
            group: sChildNeedGroup,
          }),
        );

        const sChildNeedsDonations = sChildNeeds.map((childNeed) =>
          managerSave(
            mockDataGenerator.generateMockDonation({
              childNeed,
              amount: 50,
              user: users[0],
            }),
          ),
        );

        await Promise.all([
          ...sChildNeedsDonations,
          managerSave(sChildNeedGroup),
        ]);
      };

      isDevMode && (await devOps());

      return new Promise((res) => res(InitializedDatabase));
    },
    inject: [GlobalConfigService, FileService],
  },
];
