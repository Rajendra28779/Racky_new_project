import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cpdwisemaximumandminimumlimit, cpdwisemaximumandminimumlimitupdate, cpdwisemaximumandminimumlimitupdaterecord, cpdwisemaximumandminimumlimitview } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CpdwisemaximumminimumlimitService {

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private jwtService: JwtService) { }

  cpdwisemaximumminimumlimit(cpdid:any,maxlimit:any,minlimit:any,puserid:any,Assigneduptodate){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('cpdid',cpdid)
    .append('maxlimit',maxlimit)
    // .append('minlimit',minlimit)
    .append('puserid',puserid)
    .append('Assigneduptodate',Assigneduptodate)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = cpdwisemaximumandminimumlimit ;
    return this.http.get(fullUrl, options)
  }
  viewsetMinimumMaximumLimit(cpdid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('cpdid',cpdid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = cpdwisemaximumandminimumlimitview ;
    return this.http.get(fullUrl, options)
  }
  updatethecpdwisemaximumminimumlimit(cpduserid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('cpduserid',cpduserid)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = cpdwisemaximumandminimumlimitupdate ;
    return this.http.get(fullUrl, options)
  }
  updatecpdwisemaximumminimumlimit(cpdid:any,maxlimit:any,userid:any,updatedassigneduptodate:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
    .append('cpdid',cpdid)
    .append('maxlimit',maxlimit)
    .append('userid',userid)
    .append('updatedassigneduptodate',updatedassigneduptodate)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = cpdwisemaximumandminimumlimitupdaterecord ;
    return this.http.get(fullUrl, options)
  }
}
