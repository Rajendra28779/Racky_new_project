import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { genrateOtpFormExpiredBeneficiary, getactionlogofmakealive, getExpiredBeneficiaryData, getExpiredUpdate, getMakeAliveListData, getmortality, validateotpforexpiredBeneficiary } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ExpiredBeneficiaryRptService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  expiredBeneficiaryData(userId: any, fromdate: any, todate: any, stat: any, dist: any, hospitalCode: any,urn: any) {

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
      .append('urn', urn)
      .append('hospitalCode1', hospitalCode);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getExpiredBeneficiaryData;
    return this.http.get(fullUrl, options)
  }

  aliveBeneficiary(userId:any,claimId: any, urn: any, memberId: any,fromdate:any,todate:any,stat:any,dist:any,hospitalCode:any) {
    console.log(claimId+"--" +urn+"---"+memberId+"--"+fromdate+"--"+todate+"--"+stat+"--"+dist+"--"+hospitalCode);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId',userId)
      .append('claimId', claimId)
      .append('urn', urn)
      .append('memberId', memberId)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('stat', stat)
      .append('dist', dist)
      .append('hospitalCode', hospitalCode);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getExpiredUpdate;
    return this.http.get(fullUrl, options)
  }

  generateotp(userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'userid':userid
      }
    }
    let fullUrl = genrateOtpFormExpiredBeneficiary;
    return this.http.get(fullUrl, options);
  }

  validateotpforhosp(otp: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'otp':otp,
        'accessid':userid
      }
    }
    var fullUrl=validateotpforexpiredBeneficiary;
    return this.http.get(fullUrl,options)
  }
  makeAliveData(userId: any, fromdate: any, todate: any, stat: any, dist: any, hospitalCode: any) {
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
    let fullUrl = getMakeAliveListData;
    return this.http.get(fullUrl, options)
  }

  getactionloglist(clmId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('claimid', clmId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getactionlogofmakealive;
    return this.http.get(fullUrl, options)
  }

  getmortality(clmId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('claimid', clmId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getmortality;
    return this.http.get(fullUrl, options)
  }



}
