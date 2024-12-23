import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { getOverrideCode, approveOverrideCode, getPatientDetails, downloadFileByDC } from 'src/app/services/api-config';
import { Observable } from 'rxjs';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FpOverridecodeService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getOverrideCode(userId: any, fromDate: any, toDate: any,action:any,aprvStatus:any,hospitalCode:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('action', action)
      .append('aprvStatus', aprvStatus)
      .append('userId', userId)
      .append('formDate', fromDate)
      .append('toDate', toDate)
      .append('hospitalCode', hospitalCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getOverrideCode;
    return this.http.get(fullUrl, options);
  }

  approveOverrideCode(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = approveOverrideCode;
    return this.http.post(fullUrl, object, options);
  }
  getPatientDetails(urn: any, memberId: any, requestedDate: any,generatedThrough:any,hospitalCode:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let date = formatDate(requestedDate, 'dd-MMM-yy', 'en-US')
    let queryparams = new HttpParams()
      .append('urn', urn)
      .append('memberId', memberId)
      .append('requestedDate', date)
      .append('generatedThrough', generatedThrough)
      .append('hospitalCode', hospitalCode)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getPatientDetails;
    return this.http.get(fullUrl, options);
  }
  downloadFileByDC(pdfName: any, hCode: any, dateOfAdm: any) {
    let jsonObj = {
      f: pdfName,
      h: hCode,
      d: dateOfAdm,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downloadFileByDC + '?' + 'data=' + queryParam;
    return url;
  }
}
