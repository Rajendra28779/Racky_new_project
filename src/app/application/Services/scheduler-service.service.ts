import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {JwtService} from "../../services/jwt.service";
import {
  getMasterAPIServices,
  getOldDataDetails,
  getReportDataList,
  getReportDetails,
  getUserDetails
} from "../../services/api-config";

@Injectable({
  providedIn: 'root'
})
export class SchedulerServiceService {

  constructor(
    private httpClient: HttpClient,
    private jwtService: JwtService
  ) { }

  getMasterAPIServices() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    return this.httpClient.get(getMasterAPIServices, options);
  }

  getReportDataList(apiId : any, year : any , month : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let queryParams = {
      "apiId": apiId,
      "year": year,
      "month": month
    }
    return this.httpClient.post(getReportDataList, queryParams, options);
  }

  getReportDetails(reportId : any, apiId : any, dataStatus : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let queryParams = {
      "reportId": reportId,
      "apiId": apiId,
      "dataStatus": dataStatus != null ? dataStatus : ''
    }
    return this.httpClient.post(getReportDetails, queryParams, options);
  }

  getOldDataDetails(serviceName : any, oldDataId : any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let queryParams = {
      "serviceName": serviceName,
      "oldDataId": oldDataId
    }
    return this.httpClient.post(getOldDataDetails, queryParams, options);
  }
}
