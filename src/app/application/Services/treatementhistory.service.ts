import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { serchbypackage } from 'src/app/services/api-config';


@Injectable({
  providedIn: 'root'
})
export class TreatementhistoryService {

  constructor(private httpclient: HttpClient, private jwtService: JwtService) { }

  getserch(items: any) {
    console.log(items);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = serchbypackage + "?urnno=" + items.urnno + "&packagecode=" + items.Packagecode;
    return this.httpclient.get(fullUrl, options)
  }

  getserch1(urnno: any, packagecode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = serchbypackage + "?urnno=" + urnno + "&packagecode=" + packagecode;
    return this.httpclient.get(fullUrl, options)
  }
  getserch2(urnno, packagecode, token) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    })
    let options = {
      headers: headers
    }
    let fullUrl = serchbypackage + "?urnno=" + urnno + "&packagecode=" + packagecode;
    return this.httpclient.get(fullUrl, options)
  }
}
