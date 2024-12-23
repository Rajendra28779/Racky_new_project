import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { dcsumbitmethod } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class DcserviceService {

  constructor(private jwtService: JwtService,private http: HttpClient) { }


  investigation(data:FormData):Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = dcsumbitmethod;
    return this.http.post(fullUrl, data, options);

  }
}
