import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { getStateMasterDetailsSno, getDistrictDetailsByStateIdSno, getHospitalByDistrictIdSno } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class SnamasterserviceService {
 
  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private jwtService: JwtService) { }

  getStateList(snoId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams().append('snoId', snoId);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getStateMasterDetails";
    let fullUrl = getStateMasterDetailsSno;
    return this.http.get(fullUrl, options);
  }

  getDistrictListByStateId(snoId:any, stateCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('snoId', snoId)
      .append('stateCode', stateCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = getDistrictDetailsByStateIdSno;
    return this.http.get(fullUrl, options);
  }

  getHospitalbyDistrictId(snoId:any, districtCode: any, stateCode: any) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      },
      params: { 'snoId': snoId, 'districtCode': districtCode, 'stateCode': stateCode }
    };
    //var url = "master/getHospitalByDistrictId";
    let fullUrl = getHospitalByDistrictIdSno;
    return this.http.get(fullUrl, httpOptions);
  }
 

}
