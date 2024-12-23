import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getlist, savemst, update } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class OutOfPocketExpenditureServiceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }
  savemstdoc(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = savemst;
    return this.http.post(fullUrl,object,options)
  }
  getalllist() {
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.jwtService.getJwtToken()
  })
  let options = {
    headers:headers
  }
  let fullUrl = getlist;
  return this.http.get(fullUrl,options)
}
update(object: any) {
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': this.jwtService.getJwtToken()
  })
  let options = {
    headers:headers
  }
  let fullUrl = update;
  return this.http.post(fullUrl,object,options)
}

}
