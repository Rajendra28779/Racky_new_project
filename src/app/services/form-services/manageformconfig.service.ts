import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment} from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ManageformconfigService {
  serviceURL = environment.baseUrl;

  constructor(private router: Router, private http: HttpClient) { }


  addNewForm(formParams:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(formParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, environment.apiHashingKey).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = environment.baseUrl+'/addManageForm';
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }

  viewManageForm(formParams:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(formParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, environment.apiHashingKey).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = environment.baseUrl+'/viewManageFrom';
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }

  addNewFormConfig(formParams:any):Observable<any>{

       const formData          = new FormData();
       formData.append("formData", formParams);

    let serviceUrl = environment.baseUrl+'/addFormConfig';
    let serviceRes = this.http.post(serviceUrl,formData);
    return serviceRes;
  }
  //  viewFormConfig(formParams:any):Observable<any>{
  //   let requestParam = btoa(JSON.stringify(formParams));
  //   let requestToken = CryptoJS.HmacSHA256(requestParam, environment.apiHashingKey).toString();
  //   let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
  //   let serviceUrl = environment.serviceURL+'viewFormConfig';
  //   let serviceRes = this.http.post(serviceUrl,reqData);
  //   return serviceRes;
  // }
   viewFormConfig(formParams:any):Observable<any>{
    let serviceUrl = environment.baseUrl+'/viewFormConfig';
    let serviceRes = this.http.post(serviceUrl,formParams);
    return serviceRes;
  }

 createFormConfig(formParams:any):Observable<any>{
    let serviceUrl = environment.baseUrl+'/finalSubmitData';
    let serviceRes = this.http.post(serviceUrl,formParams);
    return serviceRes;
  }

  viewFinalFormList(formParams:any):Observable<any>{
    let serviceUrl = environment.baseUrl+'/viewFormList';
    let serviceRes = this.http.post(serviceUrl,formParams);
    return serviceRes;
  } 
  
}
