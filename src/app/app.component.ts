import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoginService } from './services/shared-services/login.service';
import { SessionStorageService } from './services/session-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  userActivity;
  userInactive: Subject<any> = new Subject();
  constructor(private loginService: LoginService, private sessionService: SessionStorageService) { }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  // title = 'bsky-payment';
  ngOnInit() {
    this.callData();

    let user = this.sessionService.decryptSessionData("user");

    if (user) {
      this.setTimeout1();
      this.userInactive.subscribe(() => {
        this.loginService.logout();
      });
    }
  }
  setTimeout1() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 60000 * 30);
  }
  setTimeout2() {
    let localId = localStorage.getItem("sessionId");
    let sessionId = sessionStorage.getItem("sessionId");
    if (localId != sessionId ) {
      this.userInactive.next(undefined);
    }
  }


  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  @HostListener('window:mousemove')
  @HostListener('window:click')
  refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout1();
    this.setTimeout2();
  }
  callData() {
    const broadcastChannel = new BroadcastChannel('floatClaimActionChannel');
    broadcastChannel.onmessage = (event) => {
      if (event.data === 'checksuccess') {
        window.location.reload();
      }
    };
  }
}
