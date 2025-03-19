import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Role } from 'src/database/user';
import { IUserCookie } from 'shared/types';
import { ServerError } from 'src/utils/error';

@Injectable()
export default class SocketStorageService {
  private socketMap = new Map<string, Socket>();

  constructor() {}

  private createKey(role: Role, userId: number) {
    if (!userId || !role) throw new ServerError();

    return role + '-' + userId;
  }

  public addSocket(user: IUserCookie, socket: Socket) {
    this.socketMap.set(this.createKey(user.role, user.userId), socket);
    this.logConnectedScoket();
  }

  public getSocket(role: Role, userId: number) {
    const socket = this.socketMap.get(this.createKey(role, userId));

    if (!socket) return null;

    return socket;
  }

  public async deleteSocket(userId: number, role: Role) {
    const key = this.createKey(role, userId);

    const isExist = this.socketMap.delete(key);

    return isExist;
  }

  public logConnectedScoket() {
    console.log(this.socketMap.keys());
  }
}
