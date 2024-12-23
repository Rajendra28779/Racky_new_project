import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gethospitaldetailsinnerpage, gethospitalwusecountresult } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PaidClaimReportService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  gethospitalcountresult(formdate: any, todate: any, search: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        'formdate': formdate,
        'todate': todate,
        'searchtype': search,
        'userId': userId
      }
    }
    let fullUrl = gethospitalwusecountresult;
    return this.http.get(fullUrl, options)
  }
  gethospitaldetailsinnerpage(formdate: any, todate: any, search: any, userId: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        'formdate': formdate,
        'todate': todate,
        'searchtype': search,
        'userId': userId
      }
    }
    let fullUrl = gethospitaldetailsinnerpage;
    return this.http.get(fullUrl, options)
  }
}
