import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthIrisFingerService {
  private message: Subject<string> = new Subject<string>();
  public message$: Observable<string> = this.message.asObservable();

  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

onFirstComponentButtonClick(flag) {
    this.invokeFirstComponentFunction.emit({'flag':flag});
  }
  setMessage(newMessage) {
    this.message.next(newMessage);
  }

  private errorHandler(error) {
    this.message.next('Got an error')
  }
}
