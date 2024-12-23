import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getHospitalListData, getUrnListData } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class OngoingTreatmentReportServiceService {

  constructor(private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private jwtService: JwtService) { }
    getUrnList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
      params: {
        'urn': requestData.urn,
        'usename': requestData.userId,

      }
    };
    let fullUrl = getUrnListData;
    return this.http.get(fullUrl,options);
  }



  getHospitalList(requestData) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    console.log(requestData);
    let options = {
      headers: headers,
      params: {
        'username': requestData.username,
        'statecode': requestData.p_statecode,
        'districtcode': requestData.p_districtcode,

      }
    };
    let fullUrl = getHospitalListData;
    return this.http.get(fullUrl,options);
  }
}
