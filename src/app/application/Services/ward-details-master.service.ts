import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { savewarddetails, getallwarddetails } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class WardDetailsMasterService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }
  save(items: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = savewarddetails;
    return this.http.post(fullUrl, items, options)
  }
  getalldata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = getallwarddetails;
    return this.http.get(fullUrl, options)
  }
}
