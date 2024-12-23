import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getUnprocessConfigFilter, getUnprocessedDataById, getUnprocessedListData, saveUnprocessedMaster, updateUnprocessedMasterData } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UnprocessedConfigurationServiceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  saveUnprocessData(object: { years: String; months: any; unprocessDate: any; }) {
    // console.log("Data in service========"+ JSON.stringify(object));
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = saveUnprocessedMaster;
    return this.http.post(fullUrl, object, options);
  }
  getUnprocessFilterData(years: any, months: any) {
    // console.log(years+ " --"+months+ "--");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('years', years)
      .append('months', months);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getUnprocessConfigFilter;
    return this.http.get(fullUrl, options)
  }

  getUnprocessedData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getUnprocessedListData;
    return this.http.get(fullUrl, options);
  }
  getById(user: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getUnprocessedDataById + "?unprocessedId=" + user;
    return this.http.get(fullUrl, options);
  }

  updateUnprocessedData(data: any) {
    // console.log("upfate data comes in service"+data);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = updateUnprocessedMasterData;
    return this.http.post(fullUrl, data, options);
  }

}
