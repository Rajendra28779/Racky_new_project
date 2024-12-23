import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router , private sessionService: SessionStorageService) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this.sessionService.decryptSessionData("user");
    if (user) {
      return true;
    } else {
      this.router.navigate(['/']);
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/unauthorize'], { queryParams: { unAuthrized: state.url } });
      return false;
    }
  }
}
