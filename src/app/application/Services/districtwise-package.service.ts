import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getdistrictwisespecialitydata } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class DistrictwisePackageService {

  constructor(private jwtService: JwtService, private http: HttpClient) { }

  specialityWiseDistrictdatareport(state: any, dist: any, pack: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    // .append('userId',userId)
    .append('state',state)
    .append('dist',dist)
    .append('specialityCode',pack);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getdistrictwisespecialitydata;
    return this.http.get(fullUrl, options);
  }
}
