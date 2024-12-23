import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {

  constructor(public http :HttpClient) { }



  //changes

  // forgotpasswordfor(data:any){
  //   return this.http.post<any>('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=}API_KEY}',{requestType:'PASSWORD_RESET',
  //   email:data.email
  // })
  // }







  onforgotpassword(user :any){
    return this.http.post<any>('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=}API_KEY}',{requestType:'PASSWORD_RESET',
    email:data
  })
  }
}



