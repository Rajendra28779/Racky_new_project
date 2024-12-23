import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { formenvironment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GetwayconfiguartionService {

  serviceURL = formenvironment.serviceURL;
  constructor(private router: Router, private http: HttpClient) { }

  getPrevDetails(docParams:any):Observable<any>{
    let serviceUrl = formenvironment.serviceURL+'fillAll';
    let serviceRes = this.http.post(serviceUrl,docParams);
    return serviceRes;
  }

  newGetwayConfig(docParams:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(docParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, formenvironment.apiHashingKey).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = formenvironment.serviceURL+'insertGatewayConfiguration';
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }
  deleteGetwayConfig(docParams:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(docParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, formenvironment.apiHashingKey).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = formenvironment.serviceURL+'deletegetwayDocument';
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }
  
  viewGetwayConfig(docParams:any):Observable<any>{
      let requestParam = btoa(JSON.stringify(docParams));
      let requestToken = CryptoJS.HmacSHA256(requestParam, formenvironment.apiHashingKey).toString();
      let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
      let serviceUrl = formenvironment.serviceURL+'ViewConfiguration';
      let serviceRes = this.http.post(serviceUrl,reqData);
      return serviceRes;
    }

  // viewGetwayConfig(docParams:any):Observable<any>{
  //   let serviceUrl = environment.serviceURL+'ViewConfiguration';
  //   let serviceRes = this.http.post(serviceUrl,docParams);
  //   return serviceRes;
  // }
  
 multideleteConfig(docParams:any):Observable<any>{
  let requestParam = btoa(JSON.stringify(docParams));
  let requestToken = CryptoJS.HmacSHA256(requestParam, formenvironment.apiHashingKey).toString();
  let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = formenvironment.serviceURL+'multipleDeleteConfiguration';
    let serviceRes = this.http.post(serviceUrl,docParams);
    return serviceRes;
  }

}
