import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getCpdcountDetails, getCpdcountList } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CpdNamewiseCountReportService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }

  getCpdcountList(formdate,todate){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()

    .append('formdate', formdate)
    .append('todate', todate)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getCpdcountList;
    return this.http.get(fullUrl, options)
  }
  getdetails(useris,formdate,todate){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    .append('userId', useris)
    .append('formdate',formdate)
    .append('todate', todate)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getCpdcountDetails;
    return this.http.get(fullUrl, options)
  }






  }

