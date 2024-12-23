import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { disablehospital, gettaggedhospitallist, gettaggedhospitallistfosna,submitenablehospital } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class EnableHospitalDischargeService {



  constructor(private http: HttpClient, private jwtService: JwtService) { }

  gethospitallist(userId: any, state: any, dist: any,hosp:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': userId,
        'state': state,
        'dist': dist,
        'hospital':hosp
      }
    }
    var fullUrl =gettaggedhospitallist;
    return this.http.get(fullUrl,options)
  }
  gethospitallistsna(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userid': userId,
      }
    }
    var fullUrl =gettaggedhospitallistfosna;
    return this.http.get(fullUrl,options)
  }

  submithosplist(data: { snoid: any; hospobj: any; }) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =submitenablehospital;
    return this.http.post(fullUrl,data,options)
  }
  disablehosp(data1: { snoid: any; hospobj: any; }) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =disablehospital;
    return this.http.post(fullUrl,data1,options)
  }
}
