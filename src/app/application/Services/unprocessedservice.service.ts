import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { seacrchunprocessed } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UnprocessedserviceService {
  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getUnprocessedClaims(snoid: any, fromdate: any, todate: any,userId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
      .append('snoid', snoid)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('userId', userId);

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = seacrchunprocessed;
    return this.http.get(fullUrl, options)

  }
}
