import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueryAuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = sessionStorage.getItem('queryuser');
    if (user) {
      return true;
    } else {
      // this.router.navigate(['/']);
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/querylogin'], {
        queryParams: { unAuthrized: state.url },
      });
      return false;
    }
  }
}
