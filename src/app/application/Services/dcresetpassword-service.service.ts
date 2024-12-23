import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ListHospitalInfoForResetOfDC, resetpasswordofdC } from 'src/app/services/api-config';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class DcresetpasswordServiceService {

  constructor(private http: HttpClient,private jwtService: JwtService) { }

  getHospitalInfoForResetpassOfDC(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = ListHospitalInfoForResetOfDC+"?userId="+userId;

    return this.http.get(fullUrl, options)
  }

}
