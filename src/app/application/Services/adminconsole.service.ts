import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';
import { getUserDetails, getGlobalLinks, getPrimaryLinks, setPrimaryLinks, getAllGroups, setPrimaryLinksForGroup } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class AdminconsoleService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getUserList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getCPDDetails";
    let fullUrl = getUserDetails;
    return this.http.get(fullUrl, options);
  }

  getGroupList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getAllGroups;
    return this.http.get(fullUrl, options);
  }

  getGlobalLinks(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    };
    //let fullUrl = snoDetails;
    //var url = "master/getCPDDetails";
    let fullUrl = getGlobalLinks;
    return this.http.get(fullUrl, options);
  }

  getPrimaryLinks(userId: any, globalLink: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('globalLinkId', globalLink);
    let options = {
      headers: headers,
      params: queryparams
    };
    //let fullUrl = snoDetails;
    //var url = "master/getCPDDetails";
    let fullUrl = getPrimaryLinks;
    return this.http.get(fullUrl, options);
  }

  setPrimaryLinks(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getCPDDetails";
    let fullUrl = setPrimaryLinks;
    return this.http.post(fullUrl, object, options);
  }

  setPrimaryLinksForGroup(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //let fullUrl = snoDetails;
    //var url = "master/getCPDDetails";
    let fullUrl = setPrimaryLinksForGroup;
    return this.http.post(fullUrl, object, options);
  }

}
