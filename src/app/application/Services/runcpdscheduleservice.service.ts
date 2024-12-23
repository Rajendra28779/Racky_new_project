import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gettotalcasetobeassignforcpdschedule, runcpdscheduleDishonoredproc, runcpdscheduleFreshproc } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class RuncpdscheduleserviceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  totalCaseTobeAssign() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = gettotalcasetobeassignforcpdschedule;
    return this.http.get(fullUrl, options);
  }


  runcpdscheduleFreshClaim() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = runcpdscheduleFreshproc;
    return this.http.get(fullUrl, options);
  }


  runcpdscheduleDishonored() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
    };
    let token = this.jwtService.getJwtToken();
    let fullUrl = runcpdscheduleDishonoredproc;
    return this.http.get(fullUrl, options);
  }




}
