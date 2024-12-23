import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { actionList, getAllAction, getDraftHistoryofclaimno } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SnacpdreportService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getActionTypeList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    //let token = this.jwtService.getJwtToken();
    let fullUrl = actionList;
    return this.http.get(fullUrl, options)
  }
  getAllActionReports(flag, actionId, fromDate, toDate) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('flag', flag)
      .append('actionId', actionId)
      .append('fromDate', fromDate)
      .append('toDate', toDate);
    let options = {
      headers: headers,
      params: queryparams
    }
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getAllAction;
    return this.http.get(fullUrl, options)
  }
  getDraftAplicationdetails(claimId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams().append('claimId', claimId);
    let options = {
      headers: headers,
      params: queryparams,
    };
    let fullUrl = getDraftHistoryofclaimno;
    return this.http.get(fullUrl, options);

  }
}
