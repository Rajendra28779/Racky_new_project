import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  DischargedetailsHistory } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PaidServiceService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  gettrackingdetails(transactiondetailsid: any) {
    // alert("hii")
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      // .append('userid',userid)
      .append('transactiondetailsid', transactiondetailsid);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = DischargedetailsHistory;
    return this.http.get(fullUrl, options)
  }

}
