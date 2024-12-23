import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  downloadfileCpdRegistration,
  finalapproveapplication,
  getapprovedapplicationdetails,
  getfreshapplication,
  getfreshapplicationdetails,
  getviewapplication,
  scheduleapplication,
  snoapprovallist,
  testWhatsAppMessage,
} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class HrApprovalService {
  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getFreshApplication(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getfreshapplication;
    return this.http.post(fullUrl, requestData, options);
  }
  getFreshApplicationDetails(cpdUserId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('userId', cpdUserId);

    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getfreshapplicationdetails;
    return this.http.get(fullUrl, options);
  }
  scheduleApplication(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = scheduleapplication;
    return this.http.post(fullUrl, data, options);
  }
  getViewApplication(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
    };
    let fullUrl = getviewapplication;
    return this.http.post(fullUrl, requestData, options);
  }

  downloadfileCpdRegistration1(filename: any, prefix: any,cpdUserId: any) {
    let jsonObj = {
      f: filename,
      p: prefix,
      u: cpdUserId
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    return this.http.get(downloadfileCpdRegistration + '?' + 'data=' + queryParam, {responseType:'blob'}) ;
  }
  downloadfileCpdRegistration(filename: any, prefix: any,cpdUserId: any) {
    let jsonObj = {
      f: filename,
      p: prefix,
      u: cpdUserId
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downloadfileCpdRegistration + '?' + 'data=' + queryParam;
    return url;
  }
  getApprovedApplicationDetails(cpdUserId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('userId', cpdUserId);

    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getapprovedapplicationdetails;
    return this.http.get(fullUrl, options);
  }
  finalApproveApplication(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = finalapproveapplication;
    return this.http.post(fullUrl, data, options);
  }

  onWhatsApp() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = testWhatsAppMessage;
    return this.http.get(fullUrl, options);
  }
}
