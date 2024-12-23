import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gethospitalwisepackagedata } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalwisepackageService {
 

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  hospitalwisepackagedata(userId: any, fromdate: any, todate: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('userId',userId)
    .append('fromDate',fromdate)
    .append('toDate',todate);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = gethospitalwisepackagedata;
    return this.http.get(fullUrl, options);
  }
}
