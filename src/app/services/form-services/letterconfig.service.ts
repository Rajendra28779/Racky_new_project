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
export class LetterconfigService {

  serviceURL = formenvironment.serviceURL;


  constructor( private router: Router, private http: HttpClient) { 
  } 

  newLetter(letterParams:any):Observable<any>{

    let requestParam = btoa(JSON.stringify(letterParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, formenvironment.apiHashingKey).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = formenvironment.serviceURL+'letterconfig';
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }

  viewLetters(letterParams:any):Observable<any>{
    let requestParam = btoa(JSON.stringify(letterParams));
    let requestToken = CryptoJS.HmacSHA256(requestParam, formenvironment.apiHashingKey).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceUrl = formenvironment.serviceURL+'viewLetterConfig';
    let serviceRes = this.http.post(serviceUrl,reqData);
    return serviceRes;
  }
  
   // viewLetters(letterParams:any):Observable<any>{
  //   let serviceUrl = environment.serviceURL+'viewLetterConfig';
  //   let serviceRes = this.http.post(serviceUrl,letterParams);
  //   return serviceRes;
  // }
  //  newLetter(letterParams:any):Observable<any>{
    //   let serviceUrl = environment.serviceURL+'letterconfig';
    //   let serviceRes = this.http.post(serviceUrl,letterParams);
    //   return serviceRes;
    // }


  // viewLetters(letterParams:any):Observable<any>{
  //   let serviceUrl = environment.serviceURL+'viewLetterConfig';
  //   let serviceRes = this.http.post(serviceUrl,letterParams);
  //   return serviceRes;
  // }

  // deleteLetter(letterParams:any):Observable<any>{
  //   let serviceUrl = environment.serviceURL+'DeleteLetterConfig';
  //   let serviceRes = this.http.post(serviceUrl,letterParams);
  //   return serviceRes;
  // }
}
