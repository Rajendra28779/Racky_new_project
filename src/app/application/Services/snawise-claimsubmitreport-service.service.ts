import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getSNADischargeAndClaim,snamonthwisedischargelist,hospitalwisedischargelist } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SnawiseClaimsubmitreportServiceService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  searchSnaClaimList(year: any, snadoctor: any) {
    // console.log(year+"---"+snadoctor);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('snadoctor', snadoctor)
      .append('year', year)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getSNADischargeAndClaim;
    return this.http.get(fullUrl, options)
  }

  snamonthwisedischargelist(selectedYear: any, selectedmonth: any,userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        "year":selectedYear,
        "month":selectedmonth,
        "userid":userid
      }
    }
    let fullUrl = snamonthwisedischargelist;
    return this.http.get(fullUrl, options)
  }

  hospitalwisedischargelist(selectedYear: any, selectedmonth: any, userId: any, statecode: any, distcode: any, hospcode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        "year":selectedYear,
        "month":selectedmonth,
        "userid":userId,
        "statecode":statecode,
        "distcode":distcode,
        "hospcode":hospcode,
      }
    }
    let fullUrl = hospitalwisedischargelist;
    return this.http.get(fullUrl, options)
  }

}
