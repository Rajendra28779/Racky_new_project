import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getcpdactionreport } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CPDActionReportServiceService {

  constructor(private http: HttpClient,private jwtService: JwtService) {}
    getcpdaction(userId,yearId,monthId) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken(),
      })

      let queryparams = new HttpParams()
      .append('userId',userId)
      .append('month', monthId)
      .append('year', yearId);

      let options = {
        headers: headers,
        params: queryparams
      }
      let fullUrl =getcpdactionreport;
      return this.http.get(fullUrl, options)
    }
  }
