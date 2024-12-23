import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyAaaaRecord } from 'dns';
import { getpostname, savepostname, updatepostname } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PostmasterServiceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }
  savepostname(postname:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = savepostname;
    return this.http.post(fullUrl,postname,options)
  }
  getallpostname(){
    let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.jwtService.getJwtToken()
  })
  let options = {
    headers:headers
  }
  var fullUrl =getpostname;
  return this.http.get(fullUrl,options)
}
updatepostname(object: any){
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.jwtService.getJwtToken()
  })
  let options = {
    headers:headers
  }
  let fullUrl = updatepostname;
  return this.http.post(fullUrl,object,options)
}
}
