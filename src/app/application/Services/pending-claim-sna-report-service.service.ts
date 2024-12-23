import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getSNADischargeData, getSNATaggedHospital } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PendingClaimSnaReportServiceService {
 
 

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getHospitalTageed(name: any) : Observable<any> {
   
    let headers = new HttpHeaders({
       'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "userid": name
      }
    };
    let fullUrl = getSNATaggedHospital;
    return this.http.get(fullUrl, options);
  }
  searchReportList(snadoctor: any, hospitalCode: string) {

    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('snadoctor', snadoctor)
      .append('hospitalCode', hospitalCode)
    
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getSNADischargeData;
    return this.http.get(fullUrl, options)
  }
}
