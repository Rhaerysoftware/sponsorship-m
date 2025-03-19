import { Injectable, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import WebSocketAuthGuard from 'src/guards/websoocket.auth.guard';

@Injectable()
export default class BaseSocket {
  constructor() {}

  public afterInit(server: Server) {
    console.log(' Socket has been created and ready to serve', server);
  }

  @UseGuards(WebSocketAuthGuard)
  public async handleConnection(client: Socket) {
    console.log('HandleConnection:', client);
  }

  public async handleDisconnect(client: Socket) {}
}
