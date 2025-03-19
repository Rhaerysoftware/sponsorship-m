import { Injectable } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  ConnectedSocket,
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Role } from 'src/database/user';
import { IUserCookie } from 'shared/types';
import { ActorPoint } from 'src/websocket/messageGateway/message.gateway.interface';
import { MessageDTO } from 'shared/webSocket.types';
import { Socket, Server } from 'socket.io';
import { AuthorizationError, ServerError } from 'src/utils/error';
import JwtService from 'src/services/jwt/jwt.service';
import MessageService from 'src/modules/sponsorModule/messageModule/message.service';
import SocketStorageService from 'src/services/socketStorage/socketStorage.service';

@Injectable()
@WebSocketGateway({
  cookie: true,
  transports: ['websocket', 'polling'],
  cors: {
    origins: ['http://localhost:5173/'],
  },
})
export default class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly pointObject: ActorPoint = {
    User: 1,
    Authority: 2,
    Child: 3,
  };

  constructor(
    private messageService: MessageService,
    private socketStorgeSerice: SocketStorageService,
  ) {}

  private checkScore(p1: number, p2: number) {
    if (p1 === p2) throw new ServerError('Aynı tipte kişilere mesaj atamasın');

    return p1 + p2;
  }

  private formatCookies(parsedCookie: string, role: Role) {
    if (!parsedCookie || !Object.values(Role).includes(role))
      throw new AuthorizationError();

    const cookies = parsedCookie.split('; ');

    if (cookies.length < 1) throw new ServerError();

    const token = cookies
      .find((cookie) => cookie.includes(role + 'Authorization'))
      ?.trim()
      .split('=')[1];

    const refreshToken = cookies
      .find((cookie) => cookie.includes(role + 'Refresh'))
      ?.trim()
      .split('=')[1];

    if (!token || !refreshToken) {
      throw new AuthorizationError();
    }

    const actorCredentials = JwtService.getUserCookieFromTokens<IUserCookie>(
      token,
      refreshToken,
    );

    return actorCredentials;
  }

  private errorEmitter(client: Socket, error: Error) {
    console.log('Error:', error);

    client.emit('error', { ok: false, error });
  }

  public afterInit(server: Server) {
    console.log(' Socket has been created and ready to serve');
  }

  public async handleConnection(client: Socket) {
    try {
      const query = Object.assign({}, client.handshake.query);
      const role = query.role as Role;
      const cookieString = client.handshake.headers.cookie;

      if (!cookieString) throw new AuthorizationError();

      const user: IUserCookie = this.formatCookies(cookieString, role);

      this.socketStorgeSerice.addSocket(user, client);

      return client;
    } catch (error) {
      console.error('Handle Connection Error:', error);
      this.errorEmitter(client, error);
      return { ok: false, error };
    }
  }

  @SubscribeMessage('message')
  private async sendMessage(
    @MessageBody() { fromUser, toUser, sponsorshipId, message }: MessageDTO,
    @ConnectedSocket() fromUserSocket: Socket,
  ) {
    try {
      const user = this.formatCookies(
        fromUserSocket.handshake.headers.cookie,
        fromUserSocket.handshake.query.role as Role,
      );

      if (fromUser.userId !== user.userId) throw new AuthorizationError();

      const toUserSocket = this.socketStorgeSerice.getSocket(
        toUser.role,
        toUser.userId,
      );

      const score = this.checkScore(
        this.pointObject[user.role],
        this.pointObject[toUser.role],
      );

      let messageRecord;

      if (score === 4) {
        messageRecord = await this.messageService.message(
          user,
          toUser,
          sponsorshipId,
          message,
        );

        toUserSocket && toUserSocket.emit('receiveMessage', messageRecord);
      }
      return messageRecord;
    } catch (error) {
      console.error('Message Error:', error);
      this.errorEmitter(fromUserSocket, error);
    }
  }

  public async handleDisconnect(client: Socket) {
    try {
      const query = Object.assign({}, client.handshake.query);
      const role = query.role as Role;
      const cookieString = client.handshake.headers.cookie;

      const user = this.formatCookies(cookieString, role);

      const exist = this.socketStorgeSerice.deleteSocket(
        user.userId,
        user.role,
      );
    } catch (error) {
      console.error('Disconnect Error:', error);
    }
  }
}
