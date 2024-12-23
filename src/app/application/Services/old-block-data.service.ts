import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getOldBlockData, getOldBlockDataList, getoldblockdataviewdetails, getoldblockdataviewlist, getoldblockgenericsearch } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class OldBlockDataService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getOldBlockDataReport(userId: any, fromdate: any, todate: any, stat: any, dist: any, hospitalCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('stateId1', stat)
      .append('districtId1', dist)
      .append('hospitalCode1', hospitalCode);

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getOldBlockData;
    return this.http.get(fullUrl, options)
  }

  oldBlockDataList(userId: any, reportData:any, stat: any, dist: any, hospitalCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('reportData', reportData)
      .append('stat', stat)
      .append('dist', dist)
      .append('hospitalCode', hospitalCode);

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getOldBlockDataList;
    return this.http.get(fullUrl, options)
  }
  getoldblockgenericsearch(fieldvalue: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        "fieldvalue":fieldvalue
      }
    }
    let fullUrl = getoldblockgenericsearch;
    return this.http.get(fullUrl, options)
  }

  getoldblockdataviewlist(formdate: any, todate: any, stetecode: any, distcode: any,
     hospitalId: any, userId: any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let options = {
        headers: headers,
        params:{
          "formdate":formdate,
          "todate":todate,
          "stetecode":stetecode,
          "distcode":distcode,
          "hospitalcode":hospitalId
        }
      }
      let fullUrl = getoldblockdataviewlist;
      return this.http.get(fullUrl, options)
  }

  getoldblockdataviewdetails(txnid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        "txnid":txnid
      }
    }
    let fullUrl = getoldblockdataviewdetails;
    return this.http.get(fullUrl, options)
  }
}
