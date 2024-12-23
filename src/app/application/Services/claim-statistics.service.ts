import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getClaimStatictscDetails } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ClaimStatisticsService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }


  getClaimStatisticsDetails(fromDate,toDate,stateid,districtvalue,hospitalcode,eventName){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    .append('fromDate', fromDate)
    .append('toDate', toDate)
    .append('stateid', stateid)
    .append('districtvalue', districtvalue)
    .append('hospitalcode', hospitalcode)
    .append('eventName',eventName);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getClaimStatictscDetails;
    return this.http.get(fullUrl, options)
  }
}
