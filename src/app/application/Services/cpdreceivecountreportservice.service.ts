import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {getcpdactiontekendetails, getcpddetailsreport } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CpdreceivecountreportserviceService {



  constructor(private http: HttpClient,private jwtService: JwtService) { }

 



  cpdActiontakendetails // .append('days', days)
    (user: any, date: any, type: any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken(),
      })
      let queryparams = new HttpParams()
      .append('userId',user)
      .append('date', date)
      .append('type', type)


      let options = {
        headers: headers,
        params: queryparams
      }
      let fullUrl =getcpdactiontekendetails;
      return this.http.get(fullUrl, options)
  }

  cpddetails(user: any, date: any, type: any,seachType:any){
    // console.log(seachType+"comess");
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('userid', user)
    .append('date', date)
    .append('flag', type)
    .append('seachType',seachType);
    let options = {
      headers: headers,
      params: queryparams
    };

    let fullUrl = getcpddetailsreport;
    return this.http.get(fullUrl, options);
  }

  }


