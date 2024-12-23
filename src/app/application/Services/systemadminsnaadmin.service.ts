import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getdetailssystemadminsnarejected, getsystemadminsnarejecteddata } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SystemadminsnaadminService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }
  getlistdata(requestdata){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
    }
    let fullUrl = getsystemadminsnarejecteddata;
    return this.http.post(fullUrl,requestdata, options)
  }
  getdetails(requestdata){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
       };
    let fullUrl = getdetailssystemadminsnarejected;
    return this.http.post(fullUrl, requestdata, options);
  }
}
