import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment, formenvironment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class MessageEngineServiceService {
  serviceURL = formenvironment.serviceURL;
  constructor( private router: Router, private http: HttpClient) { 
  } 

  //  newMessage(messageParams:any):Observable<any>{
  //     let requestParam = btoa(JSON.stringify(messageParams));
  //     let requestToken = CryptoJS.HmacSHA256(requestParam, environment.apiHashingKey).toString();
  //     let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
  //     let serviceUrl = environment.serviceURL+'addMessageConfig';
  //     let serviceRes = this.http.post(serviceUrl,reqData);
  //     return serviceRes;
  //   }
   newMessage(messageParams:any):Observable<any>{
      let serviceUrl = formenvironment.serviceURL+'addMessageConfig';
      let serviceRes = this.http.post(serviceUrl,messageParams);
      return serviceRes;
    }

    viewMessage(messageParams:any):Observable<any>{  
      let serviceUrl = formenvironment.serviceURL+'viewMessageConfig';
      let serviceRes = this.http.post(serviceUrl,messageParams);
      return serviceRes;
  } 
      reminderSchedular(messageParams:any):Observable<any>{
      let serviceUrl = formenvironment.serviceURL+'getRemindercron';
      let serviceRes = this.http.post(serviceUrl,messageParams);
      return serviceRes;
      }
      executeSchedular(messageParams:any):Observable<any>{
        let serviceUrl = formenvironment.serviceURL+'startExecution';
        let serviceRes = this.http.post(serviceUrl,messageParams);
        return serviceRes;
      }
      stopSchedular(messageParams:any):Observable<any>{
        let serviceUrl = formenvironment.serviceURL+'stopExecution';
        let serviceRes = this.http.post(serviceUrl,messageParams);
        return serviceRes;
      }
  

}
