import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { getgloballinklist,getfunctionlist,getrespmlist,getfilterprimarylink,saveprimarylink,getprimarylinklist,deleteprimarylink,getprimarylinkbyid,updateprimarylink } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class PrimarylinkserviceService {



  constructor(private http: HttpClient, private jwtService: JwtService) { }
  getbyid(items:any)
  {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userId': items
      }
    }
    var fullUrl = getprimarylinkbyid;
    return this.http.get(fullUrl,options)
  }
  filter(value: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'primaryid': value.primary,
        'globalid': value.globalLinkId,
        'functionid': value.functionId,
      }
    }
    var fullUrl = getfilterprimarylink;
    return this.http.get(fullUrl,options)
  }
  delete(item: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userId': item
      }
    }
    var fullUrl = deleteprimarylink;
    return this.http.get(fullUrl,options)
  }
  getalldata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = getprimarylinklist;
    return this.http.get(fullUrl,options)
  }
  save(value: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = saveprimarylink;
    return this.http.post(fullUrl,value,options)
  }

  update(value: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updateprimarylink;
    return this.http.post(fullUrl,value,options)
  }


  getgllist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = getgloballinklist;
    return this.http.get(fullUrl,options)
  }

  getfnlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = getfunctionlist;
    return this.http.get(fullUrl,options)
  }
  getrespmlist(id:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'GId': id
      }
    }
    var fullUrl = getrespmlist;
    return this.http.get(fullUrl,options)
  }

}
