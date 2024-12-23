import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { details, dischargereport } from 'src/app/services/api-config';
// import { getdischargereport } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class TransationClaimDumpserviceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  transactionclaimdumpreport(userID:any,formdate: any, toDate: any,stateId: any,districtId: any,hospitalId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'userID':userID,
       'formdate':formdate,
        'todate':toDate,
        'stateId':stateId,
        'districtId':districtId,
        'hospitalId':hospitalId
      }
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = dischargereport;
    return this.http.get(fullUrl, options);
  }
  transactionclaimdumpreportdetails(formdate: any, toDate: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'formdate':formdate,
        'todate':toDate,

      }

    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = details;

    return this.http.get(fullUrl, options);

  }
}













