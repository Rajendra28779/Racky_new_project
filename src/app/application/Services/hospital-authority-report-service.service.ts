import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getdetailsreport,getviewremark, getclaimDetailsForHospitalAuth, getclaimQryByCPDForHospitalAuth, getclaimQryBySNAForHospitalAuth, gettaggedhospital } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalAuthorityReportServiceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getHospitalTageed(name: any) {
    console.log(name + " in service");
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
    let fullUrl = gettaggedhospital;
    return this.http.get(fullUrl, options);
  }

  getdetailsreport(fromdate: any, todate: any, searchtype: any, hospitalcode: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "fromdate": fromdate,
        "todate": todate,
        "hospital": hospitalcode,
        "searchtype": searchtype,
        "userid": userid
      }
    };
    let fullUrl = getdetailsreport;
    return this.http.get(fullUrl, options);
  }

  getviewremark(searchtype: any, claim: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })

    let options = {
      headers: headers,
      params: {
        "type":searchtype,
        "claim":claim
      }
    }
    let fullUrl = getviewremark;
    return this.http.get(fullUrl, options)
  }

  searchClaimToRaiseList(fromDate,toDate,type,hospitalCode,userId) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let queryparams = new HttpParams()
      .append('fromDate',fromDate)
      .append('toDate',toDate)
      .append('type',type)
      .append('hospitalCode',hospitalCode)
      .append('userId',userId)
      let options = {
        headers: headers,
        params: queryparams
      }
      let fullUrl = getclaimDetailsForHospitalAuth ;
      return this.http.get(fullUrl, options)
    }
    SearchClaimQueryByCPDList(fromDate,toDate,type,hospitalCode,userId) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let queryparams = new HttpParams()
      .append('fromDate',fromDate)
      .append('toDate',toDate)
      .append('type',type)
      .append('hospitalCode',hospitalCode)
      .append('userId',userId)
      let options = {
        headers: headers,
        params: queryparams
      }
      let fullUrl = getclaimQryByCPDForHospitalAuth ;
      return this.http.get(fullUrl, options)
    }
    SearchClaimQueryBySNAList(fromDate,toDate,type,hospitalCode,userId) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let queryparams = new HttpParams()
      .append('fromDate',fromDate)
      .append('toDate',toDate)
      .append('type',type)
      .append('hospitalCode',hospitalCode)
      .append('userId',userId)
      let options = {
        headers: headers,
        params: queryparams
      }
      let fullUrl = getclaimQryBySNAForHospitalAuth ;
      return this.http.get(fullUrl, options)
    }
}
