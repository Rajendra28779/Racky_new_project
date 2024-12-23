import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dctaggedReportData, getDcDetailsData } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class DctaggedService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  dctaggedReport(userId: any, stat: any, dist: any, dcId: any) {
   
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('stateId1', stat)
      .append('districtId1', dist)
      .append('dcId', dcId);

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = dctaggedReportData;
    return this.http.get(fullUrl, options)
  }

  getDcDetails(userId: any, assignDc: any, stateId: any, districtId: any) {
   
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('assignDc', assignDc)
      .append('stateId', stateId)
      .append('districtId', districtId);

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getDcDetailsData;
    return this.http.get(fullUrl, options)
  }
}
