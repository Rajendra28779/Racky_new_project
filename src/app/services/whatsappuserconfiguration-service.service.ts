import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getUserNamebyGroupId, getwhatsappconfigviewlist, getwhatsapptemplatename, inactiveonwhatsappconfig, savewhatappuserconfig } from './api-config';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsappuserconfigurationServiceService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }
  getgllist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = getwhatsapptemplatename;
    return this.http.get(fullUrl,options)
  }
  getUserNamebyGroupId(grouplist){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let queryparams = new HttpParams()
      .append('grouplist', grouplist);
    let options = {
      headers: headers,
      params: queryparams,
    };
    //let token = this.jwtService.getJwtToken();
    let fullUrl = getUserNamebyGroupId;
    return this.http.get(fullUrl, options);
  }
  savewhatsappconfigname(data: any) {
    console.log(data);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = savewhatappuserconfig;

    return this.http.post(fullUrl, data, options);
  }
  getwhatsappconfigviewlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = getwhatsappconfigviewlist;
    return this.http.get(fullUrl,options)
  }

  inactiveonwhatsappconfig(configid: any, status: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        configid:configid,
        status:status
      }
    }
    let fullUrl = inactiveonwhatsappconfig;
    return this.http.get(fullUrl,options)
  }
}
