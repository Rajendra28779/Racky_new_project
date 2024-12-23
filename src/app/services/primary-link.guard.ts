import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map } from 'rxjs';
import { GuardService } from './guard.service';
import { HeaderService } from '../application/header.service';
import { EncryptionService } from './encryption.service';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PrimaryLinkGuard implements CanActivateChild {

  res: any;
  constructor(
    private router: Router,
    private guard: GuardService,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService) { }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var user = this.sessionService.decryptSessionData("user");
    if (user) {
      var url = state.url;
      return this.guard.checkPrimaryLinkAccess(user.userId, url).pipe(
        map((result: any) => {
          result = this.encryptionService.getDecryptedData(result);
          if (result.status == 'success' && result.message == 'success') {
            if (result.data.message) {
              sessionStorage.setItem('globalLink', result.data.message);
            }
            return true;
          } else {
            this.router.navigate(['/unauthorize'], { queryParams: { unAuthrized: state.url } });
            return false;
          }
        })
      );
    } else {
      this.router.navigate(['/unauthorize'], { queryParams: { unAuthrized: state.url } });
      return false;
    }
  }

}
