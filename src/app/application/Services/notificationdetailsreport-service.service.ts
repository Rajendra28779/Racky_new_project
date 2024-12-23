import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getNotificationDetailsOnSearch, getNotificationDetailsReportData } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationdetailsreportServiceService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }



  getNotificationdetailsReport(fromdate: any, todate: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'fromdate':fromdate,
        'todate':todate
      }

    }
    var fullUrl=getNotificationDetailsReportData;
    return this.http.get(fullUrl,options)
  }


  getSearchData(fromdate: any, todate: any, groupId: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'fromdate':fromdate,
        'todate':todate,
        'groupId':groupId
      }

    }
    var fullUrl=getNotificationDetailsOnSearch;
    return this.http.get(fullUrl,options)
  }
}
