import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { snadoctortagdetails,snadoctortag } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class SnadoctorserviceService {


  constructor(private http: HttpClient,private jwtService: JwtService) { }

  getsnadetailslist(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params: {
        'userId': userId,
         }
    }
    let fullUrl =snadoctortag;
    return this.http.get(fullUrl, options)
  }
  getsnadoctordetailslist(userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params: {
        'userId': userid,
         }
    }
    let fullUrl =snadoctortagdetails;
    return this.http.get(fullUrl, options)
  }

}
