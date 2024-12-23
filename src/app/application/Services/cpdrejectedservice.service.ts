import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { cpdRejectList, distListCpd, hospitalListcpd, statelistCpd } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CpdrejectedserviceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }
  // getcpdrejectedlist(userId:any,fromDate,toDate,stateCode1,distCode1,hospitalCode,mortality,description) {
    getcpdrejectedlist(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    // let queryparams=new HttpParams()
    // .append('userId',userId) 
    // .append('fromDate',fromDate)
    // .append('toDate',toDate)
    // .append('stateCode',stateCode1)
    // .append('distCode',distCode1)
    // .append('hospitalCode',hospitalCode)
    // .append('mortality',mortality)
    // .append('description',description); 
    let options = {
      headers: headers,
      // params:queryparams
    }
    let fullUrl = cpdRejectList ;
    return this.http.post(fullUrl,requestData, options);
  }

  getStateList(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers
    }
    let fullUrl = statelistCpd;
    return this.http.get(fullUrl, options)
  }

  getDistrictListByState(Id,stateCode){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams=new HttpParams().append('stateCode',stateCode).append('userId',Id);
    let options = {
      headers: headers,
      params:queryparams
    }
    //let token = this.jwtService.getJwtToken();
    let fullUrl = distListCpd;
    return this.http.get(fullUrl, options)

  }

  getHospitalByDist(Id,stateCode,distCode){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams=new HttpParams().append('stateCode',stateCode).append('distCode',distCode).append('userId',Id);
    let options = {
      headers: headers,
      params:queryparams
    }
    //let token = this.jwtService.getJwtToken();
    let fullUrl = hospitalListcpd;
    return this.http.get(fullUrl, options)

  }
}
