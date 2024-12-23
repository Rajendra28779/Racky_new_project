import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getsnaRejetdList } from './services/api-config';
import { JwtService } from './services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SnarejectedserviceService {

 
  constructor(private http: HttpClient,private jwtService: JwtService) { }
  getpaymentlist(userId, fromDate, toDate, stateCode1, distCode1, hospitalCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('stateCode', stateCode1)
      .append('distCode', distCode1)
      .append('hospitalCode', hospitalCode);

    let options = {
      headers: headers,
      params: queryparams
    }
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getsnaRejetdList;
    return this.http.get(fullUrl, options)
  }
}
