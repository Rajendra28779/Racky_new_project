import { Injectable } from '@angular/core';
import {JwtService} from "../../services/jwt.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {
  getCPDPaymentCalculationList,
  getCPDPaymentDetailsUserId,
  getCPDUserList,
  getUserDetails
} from "../../services/api-config";

@Injectable({
  providedIn: 'root'
})
export class CpdPaymentCalculationService {

  constructor(private jwtService: JwtService,
              private httpClient: HttpClient) { }

  getCPDUserList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.get(getCPDUserList, options);
  }

  getCPDPaymentCalculationList(fromDate: any, toDate: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = {
      fromDate: fromDate,
      toDate: toDate,
      cpdUserId: userId != undefined ? userId : 0
    }

    let options = {
      headers: headers,
      params: queryparams
    };
    return this.httpClient.get(getCPDPaymentCalculationList, options);
  }

  getCPDPaymentDetailsUserId(fromDate: any, toDate: any, userId: any, actionCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = {
      fromDate: fromDate,
      toDate: toDate,
      cpdUserId: userId,
      actionCode: actionCode
    }

    let options = {
      headers: headers,
      params: queryparams
    };
    return this.httpClient.get(getCPDPaymentDetailsUserId, options);
  }
}
