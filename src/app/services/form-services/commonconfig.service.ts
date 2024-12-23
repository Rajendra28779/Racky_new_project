import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';



@Injectable({
  providedIn: 'root'
})
export class CommonconfigService {
 serviceURL = environment.baseUrl;
  constructor(private router: Router, private http: HttpClient) { }

  public getModules() {
    let serviceURL = environment.baseUrl + '/getmodules';
    let moduleResponse = this.http.post(serviceURL, null);
    return moduleResponse;
  }
  public getForms() {
    let serviceURL = environment.baseUrl + '/getForms';
    let moduleResponse = this.http.post(serviceURL, null);
    return moduleResponse;
  }
  public getFormName(formParams:any):Observable<any> {
    let serviceURL = environment.baseUrl + '/getFormName';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }
  deleteAll(formParams:any,fname:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(formParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, environment.baseUrl).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = environment.baseUrl+fname;
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }
  publishAll(formParams:any,fname:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(formParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, environment.baseUrl).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = environment.baseUrl+fname;
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }
  unpublishAll(formParams:any,fname:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(formParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, environment.baseUrl).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = environment.baseUrl+fname;
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }


  public getGetwayType() {
    let serviceURL = environment.baseUrl + 'getwayType';
    let moduleResponse = this.http.get(serviceURL);
    return moduleResponse;
  }


  public getGetwayName(formParams:any):Observable<any> {
    let serviceURL = environment.baseUrl + '/gatewayConfiguration';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  public schemeDynCtrls(formParams:any):Observable<any> { 
    let serviceURL = 'http://192.168.103.240:7001/fard_sugam_dev/admin/api/getDynmCntrls';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }



  public tableColumnFetch(formParams:any):Observable<any> {
    let serviceURL = environment.baseUrl + '/tableColumnFetch';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }
  
  public getConfigurationKeys(formParams:any):Observable<any> {
    let serviceURL = environment.baseUrl + '/formDetailsData';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }


  public getModFormName(formParams:any):Observable<any> {
    let serviceURL = environment.baseUrl + '/getModFormName';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }


}
