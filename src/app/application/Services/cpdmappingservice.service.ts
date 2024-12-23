import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getcpdmappingRestrictedHospital, getRestrictedHospital, getsnamappingreport } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CpdmappingserviceService {



  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getHospitalByStateCode(stateCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('stateCode', stateCode)
    // .append('districtCode', districtCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = getRestrictedHospital;
    return this.http.get(fullUrl, options);
  }


  searchCpdmappingHospitalrepo(stateCode: any,hospitalCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('stateCode', stateCode)
    .append('hospitalCode', hospitalCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = getcpdmappingRestrictedHospital;
    return this.http.get(fullUrl, options);
  }

  getsnamappingreport(state: any, dist: any, hospital: any,snastatus:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('stateCode', state)
    .append('distCode', dist)
    .append('hospitalCode', hospital)
    .append('snastatus', snastatus);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getsnamappingreport;
    return this.http.get(fullUrl, options);
  }





}
