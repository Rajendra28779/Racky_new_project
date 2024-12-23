import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { floatdetails } from '../services/api-config';
import { JwtService } from '../services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SnaFloatServiceService {
  constructor(private jwtService: JwtService,private http: HttpClient) { }
  getsnafloatDetails(fromDate,toDate, Floatnumber,userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('fromDate', fromDate)
      .append('toDate', toDate)
      .append('floatno', Floatnumber)
      .append('userId', userId)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = floatdetails;
    return this.http.get(fullUrl, options)
  }


}
