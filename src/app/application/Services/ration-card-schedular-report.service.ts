import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getrationdetailsreport, getrationreports } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class RationCardSchedularReportService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }
  getrationcardDetails(yearId,monthId){



    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    .append('month', monthId)
    .append('year', yearId)

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getrationreports;
    return this.http.get(fullUrl, options)
  }
  getrationcardreportDetails(user: any, date: any, type: any, status:any){



    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('userid', user)
    .append('date', date)
    .append('flag', type)
    .append('type', status);
    let options = {
      headers: headers,
      params: queryparams
    };

    let fullUrl = getrationdetailsreport;
    return this.http.get(fullUrl, options);
  }

  }
