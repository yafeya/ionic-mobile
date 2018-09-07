import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

export class NotificationService {
  private url = 'http://localhost:9981';
  private socket: io;
  private connected: boolean = false;

  connect() {
    if (!this.connected) {
      this.socket = io(this.url);
      this.socket.emit('connection', 'id');
      this.connected = true;
    }
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('users', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }

  disconnect() {
    this.socket.disconnect();
  }
}
