import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {JwtService} from "../../services/jwt.service";
import {getDataforresetpassword, getLockedUserList, unlockUserByUserId} from "../../services/api-config";

@Injectable({
  providedIn: 'root'
})
export class UnlockUserService {

  constructor(private httpClient : HttpClient, private jwtService : JwtService) { }

  getLockedUserList(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    }
    return this.httpClient.get(getLockedUserList, options)
  }

  unlockUser(userId : any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let params = new HttpParams()
      .append('userId', userId)

    let options = {
      headers: headers,
      params: params
    }
    return this.httpClient.get(unlockUserByUserId,  options)
  }
}
