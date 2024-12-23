import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { oldprocessblockDataReport, oldprocessdischargeDataReport } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class OldclmprocessblockrprtService {
  constructor(private http: HttpClient, private jwtService: JwtService) { }

  oldprocessblockData(userId: any, fromdate: any, todate: any, stat: any, dist: any, hospitalCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('stateId1', stat)
      .append('districtId1', dist)
      .append('hospitalCode1', hospitalCode);
    
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = oldprocessblockDataReport;
    return this.http.get(fullUrl, options)
  }

  oldprocessdischargeData(userId: any, fromdate: any, todate: any, stat: any, dist: any, hospitalCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('stateId1', stat)
      .append('districtId1', dist)
      .append('hospitalCode1', hospitalCode);
    
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = oldprocessdischargeDataReport;
    return this.http.get(fullUrl, options)
  }
}
