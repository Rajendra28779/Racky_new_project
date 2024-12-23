import { Injectable } from '@angular/core';
import { User } from 'src/app/_models/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // httpOptions = {
  //   headers: new HttpHeaders({      
  //     Accept: "application/json",
  //   }),
  // };


  isAuthenticate = false;
  serviceURL = environment.baseUrl;


 constructor( private router: Router, private http: HttpClient) { 



  }
  

  // logindetails(params:any): Observable<any> {
  //   console.log(params)
  //   let serviceURL = environment.serviceURL + 'logindetails';
  //   let loginResponse = this.http.post(serviceURL,JSON.stringify(params) );
  //   return loginResponse;
  // }


  logindetails(params:any): Observable<any> {
    let requestParam = btoa(JSON.stringify(params));
    let requestToken = CryptoJS.HmacSHA256(requestParam, environment.apiHashingKey).toString();
    let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
    let serviceURL = environment.baseUrl + '/logindetails';
    let loginResponse = this.http.post(serviceURL, reqData);
    return loginResponse;
  }
    
    public isLoggedIn(){
    
    return sessionStorage.getItem('ADMIN_SESSION') !== null;
    
    
    }
    
    
    public logout(){
    
      sessionStorage.removeItem('ADMIN_SESSION');
    
    }


    public getCaptcha() {
      let serviceURL = environment.baseUrl + 'getCaptcha';
      let loginResponse = this.http.post(serviceURL, null);
      return loginResponse;
    }

    public changePassword(formParams:any):Observable<any>{
      let serviceUrl = environment.baseUrl+'changePassword';
      let serviceRes = this.http.post(serviceUrl,formParams);
      return serviceRes;
    }

    // public uploadlogo(formParams:any):Observable<any>{
    //   let serviceUrl = environment.serviceURL+'uploadLogo';
    //   let serviceRes = this.http.post(serviceUrl,formParams);
    //   return serviceRes;
    // }

    public uploadlogo(formParams:any):Observable<any>{
      let requestParam = btoa(JSON.stringify(formParams));
      let requestToken = CryptoJS.HmacSHA256(requestParam, environment.apiHashingKey).toString();
      let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
      let serviceUrl = environment.baseUrl+'uploadLogo';
      let serviceRes = this.http.post(serviceUrl,reqData);
      return serviceRes;
    }
    
    public viewlogos(){
      
      let serviceUrl = environment.baseUrl+'viewLogo';
      let serviceRes = this.http.get(serviceUrl);
      return serviceRes;
    }

}
