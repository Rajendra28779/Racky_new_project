import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import {sysrejreports} from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class SysrejreportserviceService {


  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private jwtService: JwtService) { }

  getsysrejlist(formdate: any, todate: any, state: any, district: any, hospitalcode: any,userID:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params: {
        'formdate':formdate,
        'todate':todate,
        'state':state,
        'dist':district,
        'hospital':hospitalcode,
        'userID':userID
      }
    }
    let fullUrl = sysrejreports;
    return this.http.get(fullUrl, options)
  }
}
