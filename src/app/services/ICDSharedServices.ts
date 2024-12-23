import { Injectable, EventEmitter } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable()
export class ICDSharedServices {

  private message: Subject<string> = new Subject<string>();
  public message$: Observable<string> = this.message.asObservable();

  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

onFirstComponentButtonClick(icdData) {
    this.invokeFirstComponentFunction.emit({'icdData':icdData});
  }
  setMessage(newMessage) {
    this.message.next(newMessage);
  }

  private errorHandler(error) {
    this.message.next('Got an error')
  }
}
