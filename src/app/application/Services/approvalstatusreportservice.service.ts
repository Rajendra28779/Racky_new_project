import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getapprovalstatusllist } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ApprovalstatusreportserviceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }
  getapprovallist( hospitalcode:any ){
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: this.jwtService.getJwtToken(),
  });
  // console.log(requestData);

  let options = {
    headers: headers,
    params: {
      hospitalcode: hospitalcode,
    },
  };
  let fullUrl = getapprovalstatusllist;
  return this.http.get(fullUrl, options);
}}
