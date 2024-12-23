import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { getDgoCallCenterData, getDgoITACallCenterData, updateDgoCallCenterData } from 'src/app/services/api-config';
import {  Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DgoCallCenterService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }
  getDgoCallCenterData(userId,action,fromDate,toDate,cceId,hospitalCode,pageIn,pageEnd,queryStatus,stateCode,distCode){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('userId',userId)
      .append('action', action)
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('cceId', cceId)
      .append('hospitalCode', hospitalCode)
      .append('pageIn', pageIn)
      .append('pageEnd', pageEnd)
      .append('queryStatus', queryStatus)
      .append('stateCode', stateCode)
      .append('distCode', distCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getDgoCallCenterData;
    return this.http.get(fullUrl, options);
  }
  updateDgoCallCenterData(data:FormData):Observable<any>{
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updateDgoCallCenterData;
    return this.http.post(fullUrl, data, options);
  }
  getITADgoCallCenterData(userId,action,fromDate,toDate,hospitalCode,stateCode,distCode){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('userId',userId)
      .append('action', action)
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('hospitalCode', hospitalCode)
      .append('stateCode', stateCode)
      .append('distCode', distCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getDgoITACallCenterData;
    return this.http.get(fullUrl, options);
  }
}
