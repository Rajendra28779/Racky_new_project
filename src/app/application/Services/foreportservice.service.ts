import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getFilterFloatData, getFoReportDetails } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ForeportserviceService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getFoFilterData(formdate: any, todate: any, floateno: any) {
    console.log("Data in service=========="+formdate+ " "+todate+ ""+ floateno);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'floateno': floateno,
        'formdate': formdate,
        'todate': todate
      } 
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getFilterFloatData
    return this.http.get(fullUrl,options); 
  }   
}
