import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getdataforinternals, getsearchdatafromdates } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PaidamountserviceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }
  getsearchdata(userid:any,username:any,fromdate:any,todate:any,groupId:any,state:any,districtId:any,hospitalCode:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('userid',userid)
    .append('username',username)
    .append('fromdate',fromdate)
    .append('todate',todate)
    .append('groupId',groupId)
    .append('state',state)
    .append('districtId',districtId)
    .append('hospitalCode',hospitalCode)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getsearchdatafromdates ;
    return this.http.get(fullUrl, options)
  }
  getcllickdata(paymentdate:any,number:any,totaldischarge:any,hospitalcode:any,groupId:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('paymentdate',paymentdate)
    .append('number',number)
    .append('totaldischarge',totaldischarge)
    .append('Hospitalcode',hospitalcode)
    .append('groupId',groupId)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getdataforinternals ;
    return this.http.get(fullUrl, options)
  }
}
