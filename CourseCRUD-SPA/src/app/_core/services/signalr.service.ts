import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SignalrService {
  hubConnection: signalR.HubConnection;
  signalRUrl = environment.signalRUrl;
  courseReload = new EventEmitter<Boolean>();

  constructor() {
    this.buildConnection();
    this.startConnection();
  }

  buildConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(this.signalRUrl, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    }).build();
  }

  startConnection() {
    this.hubConnection
      .start()
      .then(() => this.registerSignalEvents())
      .catch(error => {
        console.error(error);
        setTimeout(() => this.startConnection(), 3000)
      });
  }

  registerSignalEvents() {
    this.hubConnection.on('COURSE_RELOAD', (data: Boolean) => this.courseReload.emit(data));
  }
}
