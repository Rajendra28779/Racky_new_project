import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getbenificiarydetails, getbenificiarygenderblockdata, getbenificiarygendergramdata, getbenificiarygenderwise, getbenificiaryvillagedata } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class YearwiseGenderserviceService {
  // .append('year', year);


  // .append('userId',userId);
  // .append('year', year);


  constructor(private http: HttpClient, private jwtService: JwtService) { }


  benificaryGenderWise(age: any, ageconditions: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('age', age)
      .append('ageconditions', ageconditions);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getbenificiarygenderwise;
    return this.http.get(fullUrl, options);
  }

  benificaryGenderblock(districtId: any) {
    console.log(districtId);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('districtId', districtId);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getbenificiarygenderblockdata;
    return this.http.get(fullUrl, options);
  }

  benificaryGendergram(districtId: any, blockId: any) {
    console.log(blockId, districtId);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('districtId', districtId)
      .append('blockId', blockId);

    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getbenificiarygendergramdata;
    return this.http.get(fullUrl, options);
  }


  benificaryVillage(districtId: any, blockId: any, gramId: any) {
    console.log(districtId, blockId, gramId);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('districtId', districtId)
      .append('blockId', blockId)
      .append('gramId', gramId);

    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getbenificiaryvillagedata;
    return this.http.get(fullUrl, options);
  }

  benificaryDetails(districtId: any, blockId: any, gramId: any, villageId: any) {
    console.log(districtId, blockId, gramId, villageId);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('districtId', districtId)
      .append('blockId', blockId)
      .append('gramId', gramId)
      .append('villageId', villageId)

    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getbenificiarydetails;
    return this.http.get(fullUrl, options);
  }
}
