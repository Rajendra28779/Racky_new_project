import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JwtService} from "../../services/jwt.service";
import {
  downloadOldBlockedDataFile,
  getActionTakenBlockedDataList,
  getOldBlockedClaimDetails,
  getOldBlockedClaimList,
  submitOldBlockedActionDetails,
  viewblockeddataactioncount
} from "../../services/api-config";

@Injectable({
  providedIn: 'root'
})
export class OldBlockedClaimMonitoringService {

  constructor(
    private httpClient: HttpClient,
    private jwtService: JwtService
  ) { }

  getOldBlockedClaimList(request : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.post(getOldBlockedClaimList, request, options);
  }

  getOldBlockedClaimDetails(request : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.post(getOldBlockedClaimDetails, request, options);
  }

  submitOldBlockedActionDetails(request : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.post(submitOldBlockedActionDetails, request, options);
  }

  getActionTakenBlockedDataList(request : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.post(getActionTakenBlockedDataList, request, options);
  }

  downloadOldBlockedDataFile(documentName: any, hospitalCode: any, year: any) {
    let jsonObj = {
      f: documentName,
      h: hospitalCode,
      d: year,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    return downloadOldBlockedDataFile + '?' + 'data=' + queryParam;
  }

  viewblockeddataactioncount(request: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params:{
        userId: request.userId,
        stateCode: request.stateCode,
        districtCode: request.districtCode,
        fromDate: request.fromDate,
        toDate: request.toDate,
        hospitalCode: request.hospitalCode,
        flag: request.flag,
        clmstatus: request.clmstatus,
      }
    };
    return this.httpClient.get(viewblockeddataactioncount, options);
  }

}
