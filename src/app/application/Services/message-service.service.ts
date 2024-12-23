import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { savemessage,getmessage,updatemessage } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class MessageServiceService {



  constructor(private http: HttpClient, private jwtService: JwtService) { }

  savemessagedata(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = savemessage;
    return this.http.post(fullUrl,object,options);

  }
  updatemessage(user: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updatemessage;
    return this.http.post(fullUrl,user,options);
  }
  getallmessage() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = getmessage;
    return this.http.get(fullUrl,options)
  }

}
