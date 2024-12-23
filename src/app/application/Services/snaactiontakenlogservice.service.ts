import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getsnaactontakenlogdata ,getsnawisepreauthcountdetails,snaactionreportdetails} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SnaactiontakenlogserviceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  snaActiontakenlogdata(userId: any,year: any,month: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('userId', userId)
    .append('month', month)
    .append('year', year);
    let options = {
      headers: headers,
      params: queryparams
    };

    let fullUrl = getsnaactontakenlogdata;
    return this.http.get(fullUrl, options);
  }

  snaActiontakendetails(user: any, date: any, type: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('userId', user)
    .append('action', type)
    .append('date', date);
    let options = {
      headers: headers,
      params: queryparams
    };

    let fullUrl = snaactionreportdetails;
    return this.http.get(fullUrl, options);
  }

  getsnawisepreauthcountdetails(formdate: any, todate: any, sna: any, type: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('fromdate', formdate)
    .append('todate', todate)
    .append('snadoctor', sna)
    .append('type', type);
    let options = {
      headers: headers,
      params: queryparams
    };

    let fullUrl = getsnawisepreauthcountdetails;
    return this.http.get(fullUrl, options);
  }


}
