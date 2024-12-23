import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { formenvironment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagedocumentsService {
  serviceURL = formenvironment.serviceURL;
  constructor(private router: Router, private http: HttpClient) { }


  addDocuments(docParams:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(docParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, formenvironment.apiHashingKey).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = formenvironment.serviceURL+'addManageDocument';
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }
  // addDocuments(docParams:any):Observable<any>{
  //   let serviceUrl = environment.serviceURL+'addManageDocument';
  //   let serviceRes = this.http.post(serviceUrl,docParams);
  //   return serviceRes;
  // }

  // viewDocuments(docParams:any):Observable<any>{
  //   let serviceUrl = environment.serviceURL+'viewManageDocument';
  //   let serviceRes = this.http.post(serviceUrl,docParams);
  //   return serviceRes;
  // }
  viewDocuments(docParams:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(docParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, formenvironment.apiHashingKey).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = formenvironment.serviceURL+'viewManageDocument';
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }

  deleteDocuments(docParams:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(docParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, formenvironment.apiHashingKey).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = formenvironment.serviceURL+'deleteManageDocument';
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }

  public getfileExtenshion() {
    let serviceURL = formenvironment.serviceURL + 'fileExtenshion';
    let moduleResponse = this.http.post(serviceURL, null);
    return moduleResponse;
  }


}
