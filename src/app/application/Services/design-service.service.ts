import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignServiceService {

  constructor() { }
  public pageName = new Subject<string>();
  public getPageName = this.pageName.asObservable()
  pageTitle(title) {
    // alert(title)
    this.pageName.next(title)
  }
}
