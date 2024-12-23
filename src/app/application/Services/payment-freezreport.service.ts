import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getpaymentfreezdata } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentFreezreportService {
 

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  searchReportList(userId:any,fromdate:any, todate:any,snadoctor: any, hospitalCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    // .append('userId',userId)
    .append('fromdate', fromdate)
    .append('todate', todate)
    .append('snadoctor', snadoctor)
    .append('hospitalCode', hospitalCode);
    
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getpaymentfreezdata;
    return this.http.get(fullUrl, options)
  }
}
